/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="/fonts/Inter/Inter.css" />
          <link rel="stylesheet" href="/fonts/Druk/Druk.css" />
          <script type="text/javascript" src="/static/noFlicker.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}


