import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Firetruck Invoice</title> 
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
