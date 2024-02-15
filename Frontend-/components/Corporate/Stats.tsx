
import React, { useState } from "react";
import CountUp from "react-countup";
import { Waypoint } from "react-waypoint";

const Stats = () => {
    const [viewPortEntered, setViewPortEntered] = useState(false);
    const onVWEnter = () => {
        setViewPortEntered(true);
    }

    return (
        <Waypoint onEnter={onVWEnter} >
        <div className="flex flex-wrap w-full justify-center bg-eksiCodeMedium">
            <div className="flex w-64 sm:w-full justify-center">
                <div className="block text-center">
                    <div className="p-6">
                        <h5 className="text-eksiCodeLight sm:text-5xl text-7xl font-medium mb-2">
                        {viewPortEntered && 
                            <CountUp start={0} end={42} delay={0}>
                                {({ countUpRef }) => (
                                    <span ref={countUpRef} />
                                )}
                            </CountUp>
                        }
                        </h5>
                        <p className="text-gray-700 sm:text-2xl text-3xl mb-4">
                            Telegram Grubu
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex w-60 sm:w-full md:w-48 sm:mx-20 md:mx-3 mx-50 justify-center">
                <div className="block text-center">
                    <div className="p-6">
                        <h5 className="text-eksiCodeLight sm:text-5xl text-7xl font-medium mb-2">
                        {viewPortEntered && 
                            <CountUp start={0} end={10608} delay={0}>
                                {({ countUpRef }) => (
                                    <span ref={countUpRef} />
                                )}
                            </CountUp>
                        }
                        </h5>
                        <p className="text-gray-700 sm:text-2xl text-3xl mb-4">
                            Tekil Grup Üyesi
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex sm:w-full w-64 justify-center">
                <div className="block text-center">
                    <div className="p-6">
                        <h5 className="text-eksiCodeLight sm:text-5xl text-7xl font-medium mb-2">
                        {viewPortEntered && 
                            <CountUp start={0} end={6} delay={0}>
                                {({ countUpRef }) => (
                                    <span ref={countUpRef} />
                                )}
                            </CountUp>
                        }</h5>
                        <p className="text-gray-700 sm:text-2xl text-3xl mb-4">
                            Discord Kanalı
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </Waypoint>
    );
}

export default Stats;