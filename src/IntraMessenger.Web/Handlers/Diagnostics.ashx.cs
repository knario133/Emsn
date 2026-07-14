using System.Web;
using IntraMessenger.Web.Infrastructure.Http;

namespace IntraMessenger.Web.Handlers
{
    public class Diagnostics : JsonHandlerBase
    {
        protected override string[] SupportedHttpMethods => new[] { "POST" };

        protected override bool RequiresJsonContentType => true;

        protected override object ProcessRequestInternal(HttpContext context)
        {
            return new
            {
                status = "ok",
                component = "json-handler-infrastructure"
            };
        }
    }
}
