//import '@/styles/globals.css'
import React from 'react'; 
import { Web3ModalProvider } from "../../context/web3";
 
 


export default function RootLayout({ children } : {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <body>
         
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
