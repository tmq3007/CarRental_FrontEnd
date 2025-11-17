'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Search, MapPin } from 'lucide-react';
import Image from 'next/image';
import AddressInput from '../common/address-input';
import { DateTimePicker } from '../common/date-time-picker';
import { useRouter } from 'next/navigation';
import CountUp from '@/blocks/TextAnimations/CountUp/CountUp';
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';
import { setSearchData } from '@/lib/slice/searchSlice';
import { RootState } from '@/lib/store';

interface SearchFormData {
  location: {
    province: string;
    district: string;
    ward: string;
  };
  pickupDateTime: Date | undefined;
  dropoffDateTime: Date | undefined;
}

export default function HeroSearchSection() {
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxSearchData = useSelector((state: RootState) => state.search);

  // Initialize local state with persisted Redux state
  const [searchData, setSearchDataState] = useState<SearchFormData>(() => ({
    location: {
      province: reduxSearchData.location.province || '',
      district: reduxSearchData.location.district || '',
      ward: reduxSearchData.location.ward || '',
    },
    pickupDateTime: reduxSearchData.pickupTime ? new Date(reduxSearchData.pickupTime) : undefined,
    dropoffDateTime: reduxSearchData.dropOffTime ? new Date(reduxSearchData.dropOffTime) : undefined,
  }));

  // Sync local state with Redux state if it changes (e.g., due to rehydration)
  useEffect(() => {
    setSearchDataState({
      location: {
        province: reduxSearchData.location.province || '',
        district: reduxSearchData.location.district || '',
        ward: reduxSearchData.location.ward || '',
      },
      pickupDateTime: reduxSearchData.pickupTime ? new Date(reduxSearchData.pickupTime) : undefined,
      dropoffDateTime: reduxSearchData.dropOffTime ? new Date(reduxSearchData.dropOffTime) : undefined,
    });
  }, [reduxSearchData]);

  const handleSearch = () => {
    const { province, district, ward } = searchData.location;
  
    // Update Redux store
    dispatch(
      setSearchData({
        location: { province, district, ward },
        pickupTime: searchData.pickupDateTime ? searchData.pickupDateTime.toISOString() : null,
        dropOffTime: searchData.dropoffDateTime ? searchData.dropoffDateTime.toISOString() : null,
      })
    );
  
    const queryParams = new URLSearchParams({
      locationProvince: province,
      locationDistrict: district,
      locationWard: ward,
      ...(searchData.pickupDateTime && { pickupTime: searchData.pickupDateTime.toISOString() }),
      ...(searchData.dropoffDateTime && { dropoffTime: searchData.dropoffDateTime.toISOString() }),
    }).toString();
  
    router.push(`/search?${queryParams}`);
  };

  const handleLocationChange = (field: string, value: string) => {
    setSearchDataState((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };
  
  const handlePickupDateTimeChange = (date: Date | undefined) => {
    setSearchDataState((prev) => ({
      ...prev,
      pickupDateTime: date,
    }));
  };
  
  const handleDropoffDateTimeChange = (date: Date | undefined) => {
    setSearchDataState((prev) => ({
      ...prev,
      dropoffDateTime: date,
    }));
  };

  return (
    <section className="relative pt-4 sm:pt-8 m:pt-12 px-4 sm:px-8 md:px-14 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/picture/hero-background.jpg"
          alt="Mountain lake landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto text-center w-full flex flex-col">
        {/* Hero Text */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <SplitText
              text="Where Every Journey"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <br className="hidden xs:block" />
            <span className="inline xs:hidden"> </span>
            <SplitText
              text="Become An Adventure"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </h1>

          {/* Social Proof */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs sm:text-sm font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-white mt-2 xs:mt-0">
              <span className="font-semibold text-sm sm:text-base">
                <CountUp
                  from={0}
                  to={33000}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />{' '}
                People Booked
              </span>
              <br />
              <span className="text-xs sm:text-sm opacity-90">Dream Place</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="flex items-center justify-center w-full">
          <div className="max-w-3xl mb-8 sm:mb-12 md:mb-16" style={{ minWidth: '60%' }}>
            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                Find Your Perfect Ride
              </h2>
              <p className="text-white/80 text-sm sm:text-base">
                Choose your destination and dates to get started
              </p>
            </div>

            {/* Main Form Container */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Custom Grid Layout */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Location Field - Takes 2 columns and spans full height */}
                <div className="lg:row-span-2">
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Pickup Location
                        </h3>
                        <p className="text-xs text-gray-500">
                          Where do you want to pick up?
                        </p>
                      </div>
                    </div>
                    <AddressInput
                      location={searchData.location}
                      onLocationChange={handleLocationChange}
                      orientation="horizontal"
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            Pickup Time
                          </h3>
                          <p className="text-xs text-gray-500">
                            When do you need it?
                          </p>
                        </div>
                      </div>
                      <DateTimePicker
                        value={searchData.pickupDateTime}
                        onChange={handlePickupDateTimeChange}
                        label=""
                        placeholder="Select pickup date & time"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            Return Time
                          </h3>
                          <p className="text-xs text-gray-500">
                            When will you return?
                          </p>
                        </div>
                      </div>
                      <DateTimePicker
                        value={searchData.dropoffDateTime}
                        onChange={handleDropoffDateTimeChange}
                        label=""
                        placeholder="Select return date & time"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center mb-6">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 h-14 text-lg font-semibold rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                  Search Available Cars
                  <div className="hidden sm:flex items-center gap-1 ml-2 px-2 py-1 bg-white/20 rounded-md">
                    <span className="text-xs">Enter</span>
                  </div>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Free Cancellation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}