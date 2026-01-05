import { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Camera } from "lucide-react";

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  imageUrl?: string;
  country?: string;
  city?: string;
  municipality?: string;
  barangay?: string;
}

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personalInfo: PersonalInfo;
  onSave: (info: PersonalInfo) => void;
}

export function ProfileDialog({
  open,
  onOpenChange,
  personalInfo,
  onSave,
}: ProfileDialogProps) {
  const [formData, setFormData] = useState<PersonalInfo>(personalInfo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Philippine location data
  const countries = ["Philippines"];
  const cities = [
    "Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Parañaque",
    "Caloocan", "Las Piñas", "Muntinlupa", "Valenzuela", "Navotas",
    "Malabon", "Marikina", "Pasay", "Davao City", "Cebu City"
  ];
  const municipalities = [
    "Albay", "Antique", "Bacolod", "Baguio", "Batangas", "Bohol",
    "Bulacan", "Cagayan", "Camiguin", "Capiz", "Catanduanes",
    "Cavite", "Cebu", "Cotabato", "Davao del Norte", "Davao del Sur",
    "Davao Occidental", "Davao Oriental", "Dinagat Islands", "Eastern Samar",
    "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo",
    "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte",
    "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate",
    "Misamis Occidental", "Misamis Oriental", "Mountain Province",
    "Negros Occidental", "Negros Oriental", "Northern Samar",
    "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro",
    "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino",
    "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor",
    "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat",
    "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac",
    "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur",
    "Zamboanga Sibugay"
  ];
  const barangays = [
    "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5",
    "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10",
    "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15",
    "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20",
    "Barangay 21", "Barangay 22", "Barangay 23", "Barangay 24", "Barangay 25",
    "Barangay 26", "Barangay 27", "Barangay 28", "Barangay 29", "Barangay 30",
    "Barangay 31", "Barangay 32", "Barangay 33", "Barangay 34", "Barangay 35",
    "Barangay 36", "Barangay 37", "Barangay 38", "Barangay 39", "Barangay 40",
    "Barangay 41", "Barangay 42", "Barangay 43", "Barangay 44", "Barangay 45",
    "Barangay 46", "Barangay 47", "Barangay 48", "Barangay 49", "Barangay 50",
    "Barangay 51", "Barangay 52", "Barangay 53", "Barangay 54", "Barangay 55",
    "Barangay 56", "Barangay 57", "Barangay 58", "Barangay 59", "Barangay 60",
    "Barangay 61", "Barangay 62", "Barangay 63", "Barangay 64", "Barangay 65",
    "Barangay 66", "Barangay 67", "Barangay 68", "Barangay 69", "Barangay 70",
    "Barangay 71", "Barangay 72", "Barangay 73", "Barangay 74", "Barangay 75",
    "Barangay 76", "Barangay 77", "Barangay 78", "Barangay 79", "Barangay 80",
    "Barangay 81", "Barangay 82", "Barangay 83", "Barangay 84", "Barangay 85",
    "Barangay 86", "Barangay 87", "Barangay 88", "Barangay 89", "Barangay 90",
    "Barangay 91", "Barangay 92", "Barangay 93", "Barangay 94", "Barangay 95",
    "Barangay 96", "Barangay 97", "Barangay 98", "Barangay 99", "Barangay 100"
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-pink-700">Edit Personal Information 💕</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-pink-300 shadow-lg">
                  <AvatarImage src={formData.imageUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-300 to-pink-500 text-white">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-pink-500 hover:bg-pink-600 text-white border-2 border-white shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm text-pink-600">Click camera icon to upload photo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-pink-700">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-2 border-pink-200 focus:border-pink-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-pink-700">Professional Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-2 border-pink-200 focus:border-pink-400"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-pink-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border-2 border-pink-200 focus:border-pink-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-pink-700">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border-2 border-pink-200 focus:border-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-pink-700">Location</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="country" className="text-xs text-pink-600">Country</Label>
                  <Select
                    value={formData.country || ""}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="border-2 border-pink-200 focus:border-pink-400">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city" className="text-xs text-pink-600">City</Label>
                  <Select
                    value={formData.city || ""}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger className="border-2 border-pink-200 focus:border-pink-400">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="municipality" className="text-xs text-pink-600">Municipality</Label>
                  <Select
                    value={formData.municipality || ""}
                    onValueChange={(value) => setFormData({ ...formData, municipality: value })}
                  >
                    <SelectTrigger className="border-2 border-pink-200 focus:border-pink-400">
                      <SelectValue placeholder="Select municipality" />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="barangay" className="text-xs text-pink-600">Barangay</Label>
                  <Select
                    value={formData.barangay || ""}
                    onValueChange={(value) => setFormData({ ...formData, barangay: value })}
                  >
                    <SelectTrigger className="border-2 border-pink-200 focus:border-pink-400">
                      <SelectValue placeholder="Select barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {barangays.map((barangay) => (
                        <SelectItem key={barangay} value={barangay}>
                          {barangay}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-2 border-pink-200 text-pink-600 hover:bg-pink-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}