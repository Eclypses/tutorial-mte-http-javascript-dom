/*
THIS SOFTWARE MAY NOT BE USED FOR PRODUCTION. Otherwise,
The MIT License (MIT)

Copyright (c) Eclypses, Inc.

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

try {
  // This tutorial uses HTTP for communication.
  // It should be noted that the MTE can be used with any type of communication. (HTTP is not required!)

  const message: HTMLInputElement = document.querySelector("#output")!;
  const outgoingEncodedMessage: HTMLInputElement =
    document.querySelector("#encoded-output")!;
  const incomingEncodedMessage: HTMLInputElement =
    document.querySelector("#encoded-input")!;
  const decodedMessage: HTMLInputElement = document.querySelector("#input")!;
  const ip: HTMLInputElement = document.querySelector("#ip")!;
  const port: HTMLInputElement = document.querySelector("#port")!;
  const form: HTMLFormElement = document.querySelector("#form")!;

  // Here is where you would want to define defaults for the MTE

  const onSubmit = (): void => {
    form.addEventListener("submit", (e) => {
      (async () => {
        e.preventDefault();

        ip.value = ip.value ? ip.value : "localhost";
        port.value = port.value ? port.value : "27015";

        // MTE Encoding the text would go here prior to sending over HTTP
        outgoingEncodedMessage.value = message.value;

        // Send message over HTTP and receive response
        const response = await window.fetch(
          `http://${ip.value}:${port.value}/echo`,
          {
            method: "POST",
            body: outgoingEncodedMessage.value,
          }
        );

        // Grab byte array out of response
        const buffer = await response.arrayBuffer();
        const byteArray = new Uint8Array(buffer);
        incomingEncodedMessage.value = u8ToB64(byteArray);

        // MTE Decoding the bytes would go here instead of using the JavaScript TextDecoder
        decodedMessage.value = new TextDecoder().decode(byteArray);

        message.value = "";
      })().catch((error) => {
        throw error;
      });
    });
  };

  onSubmit();
} catch (error) {
  console.error(error);
}

function u8ToB64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, bytes as unknown as number[]));
}
