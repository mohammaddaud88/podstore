"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import defaultImage from "../assets/tshirt.png"
import html2canvas from "html2canvas"

export default function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(defaultImage)
    const [themeVersion, setThemeVersion] = useState(0)
    const [textInput, setTextInput] = useState("")
    const [textColor, setTextColor] = useState("#000000")
    const fileInputRef = useRef(null)
    const [tshirtSize, setTshirtSize] = useState({ width: 200, height: 200 })
    const [textPosition, setTextPosition] = useState({
        top: "45%",
        left: "50%",
        fontSize: "20px"
    })
    const [imageSelected, setImageSelected] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const { register, watch, setValue } = useForm({
        defaultValues: {
            height: "180",
            weight: "80",
            build: "athletic"
        }
    })

    const height = watch("height")
    const weight = watch("weight")
    const build = watch("build")

    const themes = [
        {
            bgColor: "bg-black",
            textColor: "text-white",
            accentColor: "bg-purple-600",
            accentHover: "hover:bg-purple-700",
            inputBg: "bg-black",
            inputBorder: "border-gray-600",
            cardBg: "bg-black",
            heading: "text-purple-400",
            navBg: "bg-gray-900",
            buttonText: "text-white",
            formText: "text-gray-300",
        },
        {
            bgColor: "bg-black",
            textColor: "text-yellow-300",
            accentColor: "bg-pink-600",
            accentHover: "hover:bg-pink-700",
            inputBg: "bg-black",
            inputBorder: "border-pink-500",
            cardBg: "bg-black",
            heading: "text-pink-400",
            navBg: "bg-pink-900",
            buttonText: "text-white",
            formText: "text-pink-200",
        },
        {
            bgColor: "bg-black",
            textColor: "text-green-400",
            accentColor: "bg-blue-600",
            accentHover: "hover:bg-blue-700",
            inputBg: "bg-black",
            inputBorder: "border-blue-500",
            cardBg: "bg-black",
            heading: "text-blue-400",
            navBg: "bg-blue-900",
            buttonText: "text-white",
            formText: "text-blue-200",
        }
    ]

    const theme = themes[themeVersion]

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key.toLowerCase() === 'q') {
                setThemeVersion((prev) => (prev + 1) % 3)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        let baseWidth = 90
        let baseHeight = 100

        const heightValue = parseInt(height) || 180
        const heightFactor = heightValue / 180

        const weightValue = parseInt(weight) || 80
        const weightFactor = weightValue / 80

        let buildFactor = 1
        switch (build) {
            case "lean":
                buildFactor = 0.8
                break
            case "regular":
                buildFactor = 1
                break
            case "athletic":
                buildFactor = 1.2
                break
            case "big":
                buildFactor = 1.6
                break
        }

        const calculatedWidth = baseWidth * weightFactor * buildFactor * 3
        const calculatedHeight = baseHeight * heightFactor * 3

        setTshirtSize({
            width: calculatedWidth,
            height: calculatedHeight
        })

        const fontSizeBase = 12
        const fontSizeFactor = (heightFactor * weightFactor * buildFactor) / 3 + 0.7

        setTextPosition({
            top: "-20%",
            fontSize: `${fontSizeBase * fontSizeFactor}px`
        })
    }, [height, weight, build])

    useEffect(() => {
        console.log(`Switched to Theme ${themeVersion + 1}`)
    }, [themeVersion])

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            setSelectedFile(URL.createObjectURL(file))
            setImageSelected(true)
        }
    }

    const handleDrop = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0]
            setSelectedFile(URL.createObjectURL(file))
            setImageSelected(true)
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleSelectFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        const tShirtElement = document.getElementById("tshirt-preview")
        if (!tShirtElement) return

        const canvas = await html2canvas(tShirtElement, { backgroundColor: null })
        const dataURL = canvas.toDataURL("image/png")

        const link = document.createElement("a")
        link.href = dataURL
        link.download = "tshirt-design.png"
        link.click()

        setIsDownloading(false)
    }

    return (
        <div className={`min-h-screen ${theme.bgColor} ${theme.textColor} p-6`}>
            <nav className={`${theme.navBg} ${theme.textColor} p-4 rounded-lg mb-6 shadow-lg`}>
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">T-Shirt Customizer</div>
                    <div className="px-3 py-1 rounded border border-white text-xs">
                        Theme {themeVersion + 1} (Alt+Q to switch)
                    </div>
                </div>
            </nav>

            <div className="flex flex-col space-y-6">
                <div className="w-full flex justify-between">
                    <div className="w-2/3 mr-6">
                        <div
                            className="border border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center h-96"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="w-24 h-24 mb-6">
                                <img
                                    src={selectedFile}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <p className="text-center mb-4">Drop an image here or</p>

                            <button
                                onClick={handleSelectFileClick}
                                className={`${theme.accentColor} ${theme.buttonText} py-2 px-6 rounded`}
                            >
                                Select File
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            <p className="text-gray-500 text-sm mt-4">10 MB maximum</p>
                        </div>

                        <p className="mt-4 text-center">
                            {imageSelected ? "Custom image selected" : "No image selected"}
                        </p>
                    </div>

                    <div className="flex flex-col w-1/3">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <label htmlFor="height" className={`block mb-2 ${theme.formText}`}>
                                    Height (cm)
                                </label>
                                <input
                                    id="height"
                                    type="number"
                                    {...register("height")}
                                    className={`w-full border ${theme.inputBorder} rounded p-3 ${theme.inputBg} ${theme.textColor}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="weight" className={`block mb-2 ${theme.formText}`}>
                                    Weight (kg)
                                </label>
                                <input
                                    id="weight"
                                    type="number"
                                    {...register("weight")}
                                    className={`w-full border ${theme.inputBorder} rounded p-3 ${theme.inputBg} ${theme.textColor}`}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="build" className={`block mb-2 ${theme.formText}`}>
                                Build
                            </label>
                            <select
                                id="build"
                                {...register("build")}
                                className={`w-full border ${theme.inputBorder} rounded p-3 ${theme.inputBg} ${theme.textColor}`}
                            >
                                <option value="lean">Lean</option>
                                <option value="regular">Regular</option>
                                <option value="athletic">Athletic</option>
                                <option value="big">Big</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="textInput" className={`block mb-2 ${theme.formText}`}>
                                Text to Print
                            </label>
                            <textarea
                                id="textInput"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                rows={3}
                                className={`w-full border ${theme.inputBorder} rounded p-3 ${theme.inputBg} ${theme.textColor}`}
                                placeholder="Type your text here..."
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="textColor" className={`block mb-2 ${theme.formText}`}>
                                Text Color
                            </label>
                            <div className="flex items-center">
                                <input
                                    id="textColor"
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="w-5 h-6 rounded cursor-pointer"
                                />
                                <span className="ml-3">{textColor}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <h2 className={`text-xl font-bold mb-4 ${theme.heading}`}>Output</h2>
                    <div
                        id="tshirt-preview"
                        className="relative border border-gray-600 rounded-lg p-2 h-120 bg-transparent"
                    >
                        <div className="flex items-center h-full">
                            <div
                                className="relative mx-auto"
                                style={{ width: `${tshirtSize.width}px`, maxWidth: "800px" }}
                            >
                                <img
                                    src={selectedFile}
                                    alt="T-Shirt Preview"
                                    className="w-full h-auto object-contain"
                                    style={{ height: `${tshirtSize.height}px` }}
                                />
                                <div
                                    className="absolute inset-0 flex items-center justify-center text-center"
                                    style={{ pointerEvents: "none" }}
                                >
                                    <p
                                        className="font-bold break-words whitespace-pre-line text-center w-3/4"
                                        style={{
                                            color: textColor,
                                            top: textPosition.top,
                                            left: textPosition.left,
                                            fontSize: textPosition.fontSize,
                                            position: "relative",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {textInput}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`${theme.accentColor} ${theme.buttonText} p-2 rounded flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95 ${isDownloading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
                                }`}
                        >
                            {isDownloading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
                                    />
                                </svg>
                            )}
                            <span>{isDownloading ? "Downloading..." : "Download"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}