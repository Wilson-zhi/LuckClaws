import Script from "next/script";

const fallbackMeasurementId = "G-Q3SQBT7Y8G";

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID || fallbackMeasurementId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `
        }}
      />
    </>
  );
}
