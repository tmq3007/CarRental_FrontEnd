"use client"
import { motion } from "framer-motion"

export default function LoadingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-200 overflow-hidden relative">
            {/* Mây bay */}
            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-80"
                        style={{
                            width: `${60 + i * 20}px`,
                            height: `${30 + i * 10}px`,
                            top: `${10 + i * 15}%`,
                            right: `${-10 + i * 20}%`,
                        }}
                        animate={{
                            x: [0, -50, 0],
                        }}
                        transition={{
                            duration: 10 + i * 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Cây cối */}
            <div className="absolute bottom-0 left-0 right-0">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bottom-20"
                        style={{
                            left: `${i * 15}%`,
                        }}
                        animate={{
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-4 h-12 bg-amber-800 mx-auto"></div>
                        <div className="w-12 h-12 bg-green-500 rounded-full -mt-6"></div>
                    </motion.div>
                ))}
            </div>

            {/* Đường đi */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-700">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 transform -translate-y-1/2">
                    <motion.div
                        className="flex space-x-8 h-full"
                        animate={{
                            x: [-100, 0],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-8 h-full bg-yellow-400"></div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Xe hơi - di chuyển từ phải sang trái */}
            <motion.div
                className="absolute bottom-32"
                style={{
                    right: '-100px',
                }}
                animate={{
                    x: ['0px', 'calc(-100vw - 100px)'],
                    y: [0, -3, 0],
                }}
                transition={{
                    x: {
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    },
                    y: {
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    },
                }}
            >
                <div className="relative transform scale-x-[-1]">
                    {/* Thân xe */}
                    <div className="w-24 h-12 bg-red-500 rounded-lg relative shadow-lg">
                        {/* Cửa sổ */}
                        <div className="absolute top-1 right-2 w-8 h-4 bg-sky-200 rounded"></div>
                        <div className="absolute top-1 left-2 w-8 h-4 bg-sky-200 rounded"></div>

                        {/* Đèn pha */}
                        <motion.div
                            className="absolute -right-1 top-3 w-2 h-3 bg-yellow-300 rounded-full"
                            animate={{
                                opacity: [1, 0.7, 1],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        />

                        {/* Khói xả */}
                        <motion.div
                            className="absolute -left-4 top-2"
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1.2, 0.5],
                                x: [0, -8, -16],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        >
                            <div className="w-3 h-3 bg-gray-300 rounded-full opacity-70"></div>
                        </motion.div>
                    </div>

                    {/* Bánh xe */}
                    <motion.div
                        className="absolute -bottom-2 left-2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600"
                        animate={{
                            rotate: -360,
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    >
                        <div className="absolute inset-1 bg-gray-400 rounded-full"></div>
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-2 right-2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600"
                        animate={{
                            rotate: -360,
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    >
                        <div className="absolute inset-1 bg-gray-400 rounded-full"></div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Nội dung loading */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold text-green-600 mb-4 drop-shadow-lg"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        Loading...
                    </motion.h1>

                    <motion.p
                        className="text-xl text-green-600 drop-shadow"
                        animate={{
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        Almost there!
                    </motion.p>
                </motion.div>

                {/* Hiệu ứng tốc độ */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-24 bg-white/30"
                            style={{
                                top: `${15 + i * 10}%`,
                                right: `${5 + i * 8}%`,
                            }}
                            animate={{
                                x: [0, -window.innerWidth - 200],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.15,
                                ease: "linear",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}