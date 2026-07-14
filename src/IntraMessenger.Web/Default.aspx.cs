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
                lblStatus.Text = "Interfaz local disponible";
            }
        }
    }
}
