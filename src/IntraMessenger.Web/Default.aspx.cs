using System;
using System.Web.UI;

namespace IntraMessenger.Web
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblStatus.Text = "En línea (P0-T02 completado)";
            }
        }
    }
}
