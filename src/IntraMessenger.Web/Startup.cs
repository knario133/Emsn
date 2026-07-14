using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(IntraMessenger.Web.Startup))]

namespace IntraMessenger.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Map SignalR for realtime communications
            app.MapSignalR();
        }
    }
}
