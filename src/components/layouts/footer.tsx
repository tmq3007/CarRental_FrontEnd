'use client'
import type React from "react"

import Link from "next/link"
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
export default function Footer() {
  const role = useSelector((state: RootState) => state.user?.role);
  const fptUniversityAddress =
      "FPT University Hà Nội, Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội"
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fptUniversityAddress)}`

  const footerSections = [
    {
      title: "RENT CARS",
      links: [
        { name: "Search Cars and Rates", href: "/", icon: ArrowRight },
        { name: "Rental Locations", href: "/locations", icon: ArrowRight },
      ],
    },
    ...(role === "customer"
        ? [
          {
            title: "CUSTOMER ACCESS",
            links: [
              { name: "Manage My Booking", href: "user/booking", icon: ArrowRight },
              { name: "My Wallet", href: "user/wallet", icon: ArrowRight },
              { name: "My Profile", href: "user/profile", icon: ArrowRight },
            ],
          },
        ]
        : []),
    ...(!role
        ? [
          {
            title: "JOIN US",
            links: [
              { name: "New User Sign Up", href: "signup", icon: ArrowRight },
              { name: "Become a Partner", href: "signup", icon: ArrowRight },
              { name: "Log In", href: "signin", icon: ArrowRight },
            ],
          },
        ]
        : []),
  ];


  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
  ]

  return (
    <footer className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Car className="h-10 w-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">RentCar Pro</h2>
                <p className="text-green-100 text-sm">Your journey starts here</p>
              </div>
            </div>

            <p className="text-green-100 leading-relaxed">
              Experience premium car rental services with our extensive fleet of vehicles. From economy cars to luxury
              SUVs, we have the perfect ride for every journey.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-green-100 hover:text-white transition-colors group">
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">24/7 Support: +1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-green-100 hover:text-white transition-colors group">
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">support@rentcarpro.com</span>
              </div>
              <div className="flex items-center gap-3 text-green-100 hover:text-white transition-colors group">
                <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">FPT University Ha Noi</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`p-2 bg-white/10 rounded-full ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-lg uppercase tracking-wide border-b border-green-300/30 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-green-100 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group"
                    >
                      <link.icon className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-700/50 border-t border-green-300/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-100 text-sm">&copy; 2024 RentCar Pro. All rights reserved.</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="privacy" className="text-green-100 hover:text-white transition-colors hover:underline">
                Privacy Policy
              </Link>
              <Link href="terms" className="text-green-100 hover:text-white transition-colors hover:underline">
                Terms of Service
              </Link>
              <Link href="contact" className="text-green-100 hover:text-white transition-colors hover:underline">
                Contact Us
              </Link>
              <Link href={googleMapsDirectionsUrl} target="_blank" className="text-green-100 hover:text-white transition-colors hover:underline">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
