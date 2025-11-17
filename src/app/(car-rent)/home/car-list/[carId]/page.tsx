"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MapPin, ShieldCheck, Star, Users2, Fuel, Gauge, CalendarRange, Sparkles } from "lucide-react"

import Breadcrumb from "@/components/common/breadcum"
import NoResult from "@/components/common/no-result"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetCarDetailQuery } from "@/lib/services/car-api"
import CarDetailsPageSkeleton from "@/components/skeleton/car-detail-skeleton"

import { cn } from "@/lib/utils"

export default function MyCarDetailsPage({ params }: { params: Promise<{ carId: string }> }) {
    const resolvedParams = React.use(params)
    const { carId } = resolvedParams
    const route = useRouter()

    const { data: carDetail, isLoading, error } = useGetCarDetailQuery(carId)
    const placeholderImage = "/picture/hero-background.jpg"
    const car = carDetail?.data ?? null

    const carImages = React.useMemo(() => {
        if (!car) {
            return [] as string[]
        }

        return [
            car.carImageFront,
            car.carImageBack,
            car.carImageLeft,
            car.carImageRight,
        ].filter(Boolean) as string[]
    }, [car])

    const [selectedImage, setSelectedImage] = React.useState<string>(
        placeholderImage
    )
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

    React.useEffect(() => {
        const nextImage = carImages[0] ?? placeholderImage

        setSelectedImage((current) => (current === nextImage ? current : nextImage))
    }, [carImages, placeholderImage])

    const additionalFunctions = React.useMemo(() => {
        const source = car?.additionalFunction

        if (!source) {
            return [] as string[]
        }

        if (Array.isArray(source)) {
            return source.filter(Boolean)
        }

        if (typeof source === "string") {
            return source
                .split(/[,;\n]/)
                .map((item) => item.trim())
                .filter(Boolean)
        }

        return [] as string[]
    }, [car])

    const termItems = React.useMemo(() => {
        const source = car?.termOfUse

        if (!source) {
            return [] as string[]
        }

        if (Array.isArray(source)) {
            return source.filter(Boolean)
        }

        if (typeof source === "string") {
            return source
                .split(/\r?\n/)
                .map((item) => item.trim())
                .filter(Boolean)
        }

        return [] as string[]
    }, [car])

    if (isLoading) {
        return <CarDetailsPageSkeleton />
    }

    if (error) {
        return <NoResult />
    }

    if (!car) {
        return <NoResult />
    }

    const statusConfig: Record<
        "verified" | "not_verified" | "stopped" | "available",
        { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
        verified: { label: "Verified", variant: "default" },
        available: { label: "Available", variant: "secondary" },
        not_verified: { label: "Pending Verification", variant: "outline" },
        stopped: { label: "Unavailable", variant: "destructive" },
    }

    const statusKey = (car.status ?? "available") as keyof typeof statusConfig
    const status = statusConfig[statusKey] ?? statusConfig.available

    const specItems = [
        { label: "License Plate", value: car.licensePlate ?? "N/A" },
        { label: "Brand", value: car.brand ?? "N/A" },
        { label: "Model", value: car.model ?? "N/A" },
        {
            label: "Production Year",
            value: car.productionYear ? `${car.productionYear}` : "N/A",
        },
        { label: "Color", value: car.color ?? "N/A" },
        { label: "Transmission", value: car.isAutomatic ? "Automatic" : "Manual" },
        { label: "Fuel", value: car.isGasoline ? "Gasoline" : "Diesel" },
        {
            label: "Seats",
            value: car.numberOfSeats ? `${car.numberOfSeats}` : "N/A",
        },
    ]

    const documentRows = [
        {
            id: 1,
            title: "Registration paper",
            status: car.registrationPaperUriIsVerified ? "Verified" : "Not verified",
        },
        {
            id: 2,
            title: "Certificate of Inspection",
            status: car.certificateOfInspectionUriIsVerified
                ? "Verified"
                : "Not verified",
        },
        {
            id: 3,
            title: "Insurance",
            status: car.insuranceUriIsVerified ? "Verified" : "Not available",
        },
    ]

    const mileageText = car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A"
    const fuelConsumptionText = car.fuelConsumption
        ? `${car.fuelConsumption} L/100 km`
        : "N/A"
    const addressText = [
        car.houseNumberStreet,
        car.ward,
        car.district,
        car.cityProvince,
    ]
        .filter(Boolean)
        .join(", ")

    const handleRentClick = () => {
        route.push(`/booking?carId=${car.id}`)
    }

    const ratingValue = Number(car.rating) || 0
    const totalReviews = Number(car.totalRating) || 0

    return (
        <div className="min-h-screen bg-muted/20 py-10">
            <div className="mx-auto flex w-full flex-col gap-8 px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: "Home", path: "/" },
                        { label: "My Car", path: "/user/my-car" },
                        {
                            label: `${car.brand ?? "Car"} ${car.model ?? "Details"}`,
                        },
                    ]}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
                    <Card className="shadow-sm">
                        <CardContent className="space-y-5 p-6">
                            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="w-full cursor-zoom-in rounded-2xl border border-border bg-muted/40 transition hover:border-primary/60 hover:shadow-lg"
                                        aria-label="Preview larger image"
                                    >
                                        <AspectRatio ratio={16 / 10} className="overflow-hidden rounded-2xl">
                                            <img
                                                src={selectedImage}
                                                alt={`${car.brand ?? "Car"} ${car.model ?? "image"}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </AspectRatio>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
                                    <AspectRatio ratio={16 / 10} className="overflow-hidden rounded-3xl border border-border">
                                        <img
                                            src={selectedImage}
                                            alt={`${car.brand ?? "Car"} ${car.model ?? "image preview"}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </AspectRatio>
                                </DialogContent>
                            </Dialog>

                            {carImages.length > 1 ? (
                                <ScrollArea className="w-full">
                                    <div className="flex w-full gap-3 pb-2">
                                        {carImages.map((image) => (
                                            <button
                                                key={image}
                                                type="button"
                                                onClick={() => setSelectedImage(image)}
                                                className={cn(
                                                    "h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 transition",
                                                    selectedImage === image
                                                        ? "border-primary ring-2 ring-primary/40"
                                                        : "border-transparent hover:border-primary/60"
                                                )}
                                                aria-label="Select car image"
                                            >
                                                <img
                                                    src={image}
                                                    alt="Thumbnail"
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="h-fit shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {car.district ? `${car.district}, ${car.cityProvince}` : car.cityProvince}
                                        </p>
                                        <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                                            {`${car.brand ?? "Car"} ${car.model ?? ""}`} {car.productionYear ? `• ${car.productionYear}` : ""}
                                        </h1>
                                    </div>
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Star
                                                key={index}
                                                className={cn(
                                                    "h-4 w-4",
                                                    index < Math.round(ratingValue)
                                                        ? "text-primary fill-current"
                                                        : "text-muted-foreground/30"
                                                )}
                                                fill={index < Math.round(ratingValue) ? "currentColor" : "none"}
                                            />
                                        ))}
                                    </div>
                                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                                    <span className="text-sm">
                                        {ratingValue.toFixed(1)} ({totalReviews} reviews)
                                    </span>
                                    {car.numberOfRides ? (
                                        <>
                                            <Separator orientation="vertical" className="hidden h-4 sm:block" />
                                            <span className="text-sm flex items-center gap-1">
                                                <Users2 className="h-4 w-4" />
                                                {car.numberOfRides} trips
                                            </span>
                                        </>
                                    ) : null}
                                </div>

                                <div className="rounded-2xl border border-border bg-muted/30 p-5">
                                    <p className="text-sm font-medium text-muted-foreground">Daily rate</p>
                                    <div className="flex items-end justify-between gap-2">
                                        <p className="text-3xl font-semibold text-foreground">
                                            {car.basePrice ? `${car.basePrice.toLocaleString()} VND` : "Contact for price"}
                                        </p>
                                        <Button size="lg" className="px-8" onClick={handleRentClick}>
                                            Rent now
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {addressText || "Location to be confirmed"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        Deposit: {car.deposit ? `${car.deposit.toLocaleString()} VND` : "No deposit required"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="mx-auto grid w-full max-w-2xl grid-cols-3 rounded-2xl bg-muted/50 p-1">
                        <TabsTrigger value="basic" className="data-[state=active]:bg-background data-[state=active]:shadow">
                            Basic Information
                        </TabsTrigger>
                        <TabsTrigger value="details" className="data-[state=active]:bg-background data-[state=active]:shadow">
                            Details
                        </TabsTrigger>
                        <TabsTrigger value="terms" className="data-[state=active]:bg-background data-[state=active]:shadow">
                            Terms of Use
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="mt-6 space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Vehicle overview</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {specItems.map((item) => (
                                    <div key={item.label} className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 shadow-sm">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            {item.label}
                                        </p>
                                        <p className="mt-2 text-base font-semibold text-foreground">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Vehicle documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/2">Document</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documentRows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell className="font-medium">{row.title}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={row.status.startsWith("Verified") ? "secondary" : "outline"}
                                                        className="capitalize"
                                                    >
                                                        {row.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details" className="mt-6 space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                                <p>{car.description ?? "No description available."}</p>

                                <Separator />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <DetailStat
                                        icon={Gauge}
                                        label="Mileage"
                                        value={mileageText}
                                    />
                                    <DetailStat
                                        icon={Fuel}
                                        label="Fuel consumption"
                                        value={fuelConsumptionText}
                                    />
                                    <DetailStat
                                        icon={MapPin}
                                        label="Pickup address"
                                        value={addressText || "Provided after booking"}
                                    />
                                    <DetailStat
                                        icon={CalendarRange}
                                        label="Production year"
                                        value={car.productionYear ? `${car.productionYear}` : "Unknown"}
                                    />
                                </div>

                                {additionalFunctions.length ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            Additional features
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {additionalFunctions.map((feature) => (
                                                <Badge key={feature} variant="outline" className="rounded-full border-dashed">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="terms" className="mt-6 space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Pricing summary</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Base price</p>
                                    <p className="mt-2 text-lg font-semibold text-foreground">
                                        {car.basePrice ? `${car.basePrice.toLocaleString()} VND / day` : "Contact"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Required deposit</p>
                                    <p className="mt-2 text-lg font-semibold text-foreground">
                                        {car.deposit ? `${car.deposit.toLocaleString()} VND` : "No deposit"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Rental terms & policies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {termItems.length ? (
                                    <Accordion>
                                        {termItems.map((term, index) => (
                                            <AccordionItem key={index} defaultOpen={index === 0}>
                                                <AccordionTrigger>Policy {index + 1}</AccordionTrigger>
                                                <AccordionContent>{term}</AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Terms will be provided before the booking is confirmed.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

type DetailStatProps = {
    icon: React.ElementType
    label: string
    value: string
}

function DetailStat({ icon: Icon, label, value }: DetailStatProps) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
            </div>
        </div>
    )
}
