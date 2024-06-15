import MainHeader from "../../Components/Header/Header"

const Error404 = () => {
    return (
        <div className="flex flex-col">
            <MainHeader />
            <section className="select-none flex flex-col justify-center items-center space-y-6 text-black py-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 lg:w-24 lg:h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>

                <div className="text-9xl font-bold text-center">404</div>
                <div className="text-base font-semibold">Oops! Looks like you've wandered off the beaten path. Let's guide you back to smoother travels!</div>
                <a href="/">
                    <button className='bg-[#17304a] rounded-lg px-5 py-3 text-white font-semibold tracking-tight'>
                        Go back to homepage
                    </button>
                </a>

            </section>
        </div>

    )
}

export default Error404