import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { useGetSEOQuery } from "./redux/features/seo/seoApi"

export default function App() {
  const { data } = useGetSEOQuery({});
  const seo = data?.data;

  return (
    <>
      <head>
        <title>{seo?.title || "Eva Glamistry Women’s Beauty Salon  | Beauty, cosmetic & personal care"}</title>
        <meta name="description" content={`${seo?.description || "Eva Glamistry Women’s Beauty Salon  | Beauty, cosmetic & personal care"}`} />
        <meta name="keywords" content={`${seo?.keywords || ""}`} />
        <meta name="author" content={`${seo?.author || ""}`} />
        <meta name="designer" content={`${seo?.designer || "Nasim Uddin & Mamunur Rashid"}`} />
        <meta name="subject" content={`${seo?.subject || ""}`} />
        <meta name="copyright" content={`${seo?.copyright || ""}`} />

        {/* <!-- Open Graph --> */}
        <meta property="og:title" content={`${seo?.title || ""}`} />
        <meta property="og:description" content={`${seo?.description || ""}`} />
        <meta property="og:image" content={`${seo?.image || " /images/og_image.jpg"}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${seo?.url || ""}`} />

        {/* <!-- Twitter --> */}
        <meta name="twitter:title" content={`${seo?.title || ""}`} />
        <meta name="twitter:description" content={`${seo?.description || ""}`} />
        <meta name="twitter:image" content={`${seo?.image || " /images/og_image.jpg"}`} />
        <meta name="twitter:card" content="summary_large_image" />


        {seo?.facebookDomainVerification ? `<meta name="facebook-domain-verification" content="${seo.facebookDomainVerification}" />` : ""}
        {seo?.googleSiteVerification ? `<meta name="google-site-verification" content="${seo.googleSiteVerification}" />` : ""}


        {
          seo?.googleTagManager
            ? `
            <script>
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${seo.googleTagManager}');
            </script>
            `
            : ""
        }
      </head>
      <RouterProvider router={router} />
    </>
  )
}

