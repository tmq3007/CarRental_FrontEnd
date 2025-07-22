import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { DateTimePicker } from "@/components/common/date-time-picker";
import AddressInput from "@/components/common/address-input";

interface LocationAndTimeFilterProps {
  pickupTime: Date | undefined;
  dropoffTime: Date | undefined;
  onPickupTimeChange: (date: Date | undefined) => void; 
  onDropoffTimeChange: (date: Date | undefined) => void; 
  location: {
    province?: string;
    district?: string;
    ward?: string;
  };
  onLocationChange: (field: string, value: string) => void;
  compact?: boolean;
}

export default function LocationAndTimeFilter({
  pickupTime,
  dropoffTime,
  onPickupTimeChange,
  onDropoffTimeChange,
  onLocationChange,
  location,
  compact = false,
}: LocationAndTimeFilterProps) {
  const formatTimeDisplay = (date: Date | null) => {
    if (!date) return "Select date & time";
    return format(date, "PPP p");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Location Field */}
        <div className="lg:row-span-2">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Pickup Location</h3>
                <p className="text-xs text-gray-500">Where do you want to pick up?</p>
              </div>
            </div>
            <AddressInput
              onLocationChange={onLocationChange}
              orientation="horizontal"
              location={location}
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
                  <h3 className="font-semibold text-gray-900 text-sm">Pickup Time</h3>
                  <p className="text-xs text-gray-500">When do you need it?</p>
                </div>
              </div>
              <DateTimePicker
                value={pickupTime}
                onChange={onPickupTimeChange}
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
                  <h3 className="font-semibold text-gray-900 text-sm">Return Time</h3>
                  <p className="text-xs text-gray-500">When will you return?</p>
                </div>
              </div>
              <DateTimePicker
                value={dropoffTime}
                onChange={onDropoffTimeChange}
                label=""
                placeholder="Select return date & time"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}