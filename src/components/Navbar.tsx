import React from 'react'

import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
    return (
        <nav className="bg-black">
            <div className="flex justify-between px-5 items-center">
                <h1 className="text-wrap font-bold text-white">
                    Bono <br /> Meme <br /> Broker
                </h1>

                <div className="flex gap-4">
                    <Link className=" text-white" href="#">Home</Link>
                    <Link className=" text-white" href="#">About</Link>
                    <Link className=" text-white" href="#">Meet Bono</Link>
                    <Link className=" text-white" href="#">Game</Link>
                    <Link className=" text-white" href="#">Roadmap</Link>
                </div>

                <div className="flex gap-4">
                    <Link href="#">
                        <Image src='/twitter.webp' width={25} height={25} />

                    </Link>
                    <Link href="#">
                        <Image src='/share.png' width={25} height={25} />

                    </Link>
                </div>
            </div>

            
        </nav>
    )
}

export default Navbar