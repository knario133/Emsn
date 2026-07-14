using System;

namespace IntraMessenger.Web.Infrastructure.Http
{
    public class ApiResponse<T>
    {
        public bool Ok { get; set; }
        public T Data { get; set; }
        public ApiError Error { get; set; }
        public string CorrelationId { get; set; }
    }
}
