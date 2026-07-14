using System;
using System.Linq;
using System.Text;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace IntraMessenger.Web.Infrastructure.Http
{
    public abstract class JsonHandlerBase : IHttpHandler
    {
        private static readonly JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Include
        };

        public bool IsReusable => false;

        protected abstract string[] SupportedHttpMethods { get; }

        protected virtual bool RequiresJsonContentType => false;

        protected abstract object ProcessRequestInternal(HttpContext context);

        public void ProcessRequest(HttpContext context)
        {
            string correlationId = Guid.NewGuid().ToString("N");

            try
            {
                context.Items["CorrelationId"] = correlationId;

                PrepareResponse(context.Response, correlationId);

                if (!ValidateHttpMethod(context))
                {
                    WriteErrorResponse(context.Response, 405, "method_not_allowed", "Método HTTP no permitido.", correlationId);
                    return;
                }

                if (!ValidateContentType(context))
                {
                    WriteErrorResponse(context.Response, 415, "unsupported_media_type", "Tipo de medio no soportado. Se esperaba application/json.", correlationId);
                    return;
                }

                object resultData = ProcessRequestInternal(context);
                WriteSuccessResponse(context.Response, resultData, correlationId);
            }
            catch (Exception)
            {
                WriteEmergencyErrorResponse(context.Response, correlationId);
            }
        }

        private void PrepareResponse(HttpResponse response, string correlationId)
        {
            response.Clear();
            response.ContentType = "application/json";
            response.ContentEncoding = Encoding.UTF8;
            response.Charset = "utf-8";
            response.TrySkipIisCustomErrors = true;

            response.Headers["X-Correlation-ID"] = correlationId;

            response.Cache.SetCacheability(HttpCacheability.NoCache);
            response.Cache.SetNoStore();
            response.Cache.SetExpires(DateTime.UtcNow.AddYears(-1));
            response.Headers["Pragma"] = "no-cache";
        }

        private bool ValidateHttpMethod(HttpContext context)
        {
            if (SupportedHttpMethods == null || SupportedHttpMethods.Length == 0)
                return false;

            bool isSupported = SupportedHttpMethods.Contains(context.Request.HttpMethod, StringComparer.OrdinalIgnoreCase);

            if (!isSupported)
            {
                string allowHeaderValue = string.Join(", ", SupportedHttpMethods.Select(m => m.ToUpperInvariant()));
                context.Response.Headers["Allow"] = allowHeaderValue;
            }

            return isSupported;
        }

        private bool ValidateContentType(HttpContext context)
        {
            if (!RequiresJsonContentType)
                return true;

            string contentType = context.Request.ContentType;
            if (string.IsNullOrEmpty(contentType))
                return false;

            string mediaType = contentType.Split(';')[0].Trim();
            return mediaType.Equals("application/json", StringComparison.OrdinalIgnoreCase);
        }

        private void WriteSuccessResponse(HttpResponse response, object data, string correlationId)
        {
            try
            {
                var apiResponse = new ApiResponse<object>
                {
                    Ok = true,
                    Data = data,
                    Error = null,
                    CorrelationId = correlationId
                };

                string json = JsonConvert.SerializeObject(apiResponse, JsonSettings);
                response.StatusCode = 200;
                response.Write(json);
            }
            catch (Exception)
            {
                WriteEmergencyErrorResponse(response, correlationId);
            }
        }

        private void WriteErrorResponse(HttpResponse response, int statusCode, string errorCode, string errorMessage, string correlationId)
        {
            try
            {
                var apiResponse = new ApiResponse<object>
                {
                    Ok = false,
                    Data = null,
                    Error = new ApiError { Code = errorCode, Message = errorMessage },
                    CorrelationId = correlationId
                };

                string json = JsonConvert.SerializeObject(apiResponse, JsonSettings);
                response.StatusCode = statusCode;
                response.Write(json);
            }
            catch (Exception)
            {
                WriteEmergencyErrorResponse(response, correlationId);
            }
        }

        private void WriteEmergencyErrorResponse(HttpResponse response, string correlationId)
        {
            try
            {
                response.Clear();
                response.ContentType = "application/json";
                response.ContentEncoding = Encoding.UTF8;
                response.Charset = "utf-8";
                response.TrySkipIisCustomErrors = true;
                response.StatusCode = 500;

                response.Headers["X-Correlation-ID"] = correlationId;

                response.Cache.SetCacheability(HttpCacheability.NoCache);
                response.Cache.SetNoStore();
                response.Cache.SetExpires(DateTime.UtcNow.AddYears(-1));
                response.Headers["Pragma"] = "no-cache";

                string safeJson = $"{{\"ok\":false,\"data\":null,\"error\":{{\"code\":\"internal_error\",\"message\":\"Ocurrió un error interno al procesar la solicitud.\"}},\"correlationId\":\"{correlationId}\"}}";
                response.Write(safeJson);
            }
            catch
            {
                // Last resort, ignore if we cannot even write the emergency string
            }
        }
    }
}
