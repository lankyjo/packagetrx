import React from 'react';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import { getPayload } from 'payload'
import config from '@payload-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, MapPin, Calendar, User, TrendingUp, Clock } from 'lucide-react'
import { FaArrowRight } from 'react-icons/fa';

import { CreateTrackingSheet } from './components/CreateTrackingSheet'; 
import { TrackingCardActions } from './components/TrackingCardActions';
import Link from 'next/link';


const generateRandomGreeting = (name: string) => {
  const hour = new Date().getHours();
  const baseGreetings = ["Hi", "Hello", "Howdy", "Welcome back"];
  let timeSensitiveGreeting = null;

  if (hour >= 1 && hour < 12) {
    timeSensitiveGreeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    timeSensitiveGreeting = "Good afternoon";
  } else if (hour >= 18 || hour < 11) {
    timeSensitiveGreeting = "Good evening";
  } else {
    timeSensitiveGreeting = "Hello there";
  }

  // Combine base greetings with the time-sensitive one
  const allGreetings = [...baseGreetings, timeSensitiveGreeting];
  
  const randomIndex = Math.floor(Math.random() * allGreetings.length);
  const selectedGreeting = allGreetings[randomIndex];

  return `${selectedGreeting}, ${name}`;
}

// --- Reusable Server-Side Components ---

const StatCard = ({ 
  icon, 
  value, 
  label, 
  iconRight, 
  className = '', 
  valueClassName = '', 
  labelClassName = '' 
}: {
  icon: React.ReactNode
  value: number
  label: string
  iconRight?: React.ReactNode
  className?: string
  valueClassName?: string
  labelClassName?: string
}) => (
  <Card className={`shadow-sm border py-0 backdrop-blur ${className}`}>
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-center justify-between mb-1">
        {icon}
        {iconRight}
      </div>
      <div className={`text-xl sm:text-2xl font-bold ${valueClassName}`}>{value}</div>
      <p className={`text-xs text-muted-foreground mt-0.5 ${labelClassName}`}>{label}</p>
    </CardContent>
  </Card>
)

const RouteDisplay = ({ 
  sender, 
  recipient 
}: { 
  sender: { name: string }
  recipient: { name: string }
}) => (
  <div className="flex items-center w-full gap-2 text-xs justify-between">
    <div >
      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
        <MapPin className="h-3 w-3 text-blue-500 flex-shrink-0" />
        <span className="truncate font-medium">{sender.name}</span>
      </div>
    </div>
    <div className="text-slate-400 flex-shrink-0"><FaArrowRight/></div>
    <div>
      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
        <MapPin className="h-3 w-3 text-green-500 flex-shrink-0" />
        <span className="truncate font-medium">{recipient.name}</span>
      </div>
    </div>
  </div>
)

const DateDisplay = ({ 
  dateReceived, 
  dateDelivered, 
  formatDate 
}: { 
  dateReceived: string
  dateDelivered: string
  formatDate: (date: string) => string
}) => (
  <div className="flex items-center justify-between text-xs bg-muted-foreground/10 rounded px-3 py-2">
    <div>
      <p className="">Received</p>
      <p className="font-semibold">{formatDate(dateReceived)}</p>
    </div>
    <div className="">•</div>
    <div className="text-right">
      <p className="">Delivery</p>
      <p className="font-semibold">{formatDate(dateDelivered)}</p>
    </div>
  </div>
)

const DriverDisplay = ({ 
  driverName, 
  driverContact 
}: { 
  driverName: string
  driverContact: string
}) => (
  <div className="flex items-center justify-between bg-muted-foreground/10 rounded px-3 py-2">
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold truncate">{driverName}</p>
        <p className="text-xs">{driverContact}</p>
      </div>
    </div>
  </div>
)

const PackageDetails = ({ 
  weight, 
  length, 
  width, 
  height, 
  declaredValue 
}: { 
  weight?: string
  length?: string
  width?: string
  height?: string
  declaredValue?: number
}) => {
  if (!weight && !declaredValue && !length) return null
  
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
      {weight && <span>⚖️ {weight}kg</span>}
      {length && width && height && (
        <span>📏 {length}×{width}×{height}</span>
      )}
      {declaredValue && <span>💰 ₦{(declaredValue / 1000).toFixed(0)}k</span>}
    </div>
  )
}

const TrackingCard = ({
  info,
  status,
  formatDate
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any
  status: { label: string; color: string }
  formatDate: (date: string) => string
}) => (
  <Card className="shadow-sm border border-slate-200/50 backdrop-blur hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
    <CardHeader className="pb-3 pt-4 px-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${status.color} text-white text-xs px-2 py-0.5`}>
              {status.label}
            </Badge>
            {info.sender.latitude && info.sender.longitude && (
              <span className="text-xs">📍</span>
            )}
          </div>
          <CardTitle className="text-sm font-bold truncate">
            <Link href={`/${info.trackingID}`}>
              {info.trackingID}
            </Link>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{info.packageName}</p>
        </div>
        <div className="flex items-center gap-1">
          <Package className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <TrackingCardActions trackingData={info} />
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="px-4 pb-4 space-y-3">
      <RouteDisplay sender={info.sender} recipient={info.recipient} />
      <DateDisplay 
        dateReceived={info.dateReceived} 
        dateDelivered={info.dateDelivered}
        formatDate={formatDate}
      />
      <DriverDisplay 
        driverName={info.assignedDriver} 
        driverContact={info.driverContact}
      />
      <PackageDetails 
        weight={info.weight}
        length={info.length}
        width={info.width}
        height={info.height}
        declaredValue={info.declaredValue}
      />
    </CardContent>
  </Card>
)

// --- Server Component Main Function ---

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  const payload = await getPayload({ config })

  // Data Fetching 
  const { docs: trackingInfo } = await payload.find({
    collection: 'trackinginfo',
    where: {
      userId: {
        equals: user?.id
      }
    },
    sort: '-createdAt',
  })
  
  // 🎯 Generate the random greeting here
  const displayName = user.given_name || user.email?.split('@')[0] || 'User';
  const dynamicGreeting = generateRandomGreeting(displayName);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatus = (dateReceived: string, dateDelivered: string) => {
    const now = new Date()
    const received = new Date(dateReceived)
    const delivery = new Date(dateDelivered)

    if (now < received) return { label: 'Pending', color: 'bg-yellow-500' }
    if (now >= received && now < delivery) return { label: 'In Transit', color: 'bg-blue-500' }
    return { label: 'Delivered', color: 'bg-green-500' }
  }

  return (
    <div className="min-h-screen pt-20 pb-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Compact Header with Dynamic Greeting */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold ">
              {dynamicGreeting}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage your shipments</p>
          </div>
          
          <CreateTrackingSheet />
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          <StatCard
            icon={<Package className="h-4 w-4 text-slate-500" />}
            value={trackingInfo.length}
            label="Total"
            iconRight={<TrendingUp className="h-3 w-3 text-green-500" />}
            className="border-slate-200/50"
          />

          <StatCard
            icon={<Clock className="h-4 w-4 text-blue-600" />}
            value={trackingInfo.filter(t => getStatus(t.dateReceived as string, t.dateDelivered as string).label === 'In Transit').length}
            label="In Transit"
            className="border-blue-200/50"
            valueClassName="text-blue-700"
            labelClassName="text-blue-700"
          />

          <StatCard
            icon={<Calendar className="h-4 w-4 text-green-600" />}
            value={trackingInfo.filter(t => getStatus(t.dateReceived as string, t.dateDelivered as string).label === 'Delivered').length}
            label="Delivered"
            className="border-green-200/50"
            valueClassName="text-green-700"
            labelClassName="text-green-700"
          />
        </div>

        {/* 🎯 New Header for Tracking Cards */}
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
                Your Shipments
            </h2>
            <p className="text-sm text-muted-foreground">
                Showing {trackingInfo.length} packages
            </p>
        </div>


        {/* Compact Tracking Cards */}
        {trackingInfo.length === 0 ? (
          <Card className="shadow-sm border border-gray-200 backdrop-blur">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold  mb-1">No packages yet</h3>
              <p className="text-sm text-slate-600">Create your first tracking to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trackingInfo.map((info) => {
              const status = getStatus(info.dateReceived as string, info.dateDelivered as string)
              
              return (
                <TrackingCard 
                  key={info.id}
                  info={info}
                  status={status}
                  formatDate={formatDate}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}