"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Hello,</h3>
                <p className="text-gray-400 text-sm">How can we help you?</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-4 space-y-3">
            <a
              href="#"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Track Your Order</p>
                <p className="text-xs text-gray-500">Live updates on delivery</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="#"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Product Help</p>
                <p className="text-xs text-gray-500">Find the right supplement</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="#"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Returns & Refunds</p>
                <p className="text-xs text-gray-500">Easy return process</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            <button className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
              Start a Conversation
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open chat"
      >
        <div
          className={`
            relative flex items-center justify-center
            w-14 h-14
            bg-gradient-to-br from-gray-200 to-gray-100
            rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md
            shadow-lg shadow-gray-400/30
            transition-all duration-300
            hover:shadow-xl hover:shadow-gray-400/40
            hover:-translate-y-0.5
            ${isOpen ? "rotate-0" : ""}
          `}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {isOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <MessageCircle className="w-6 h-6 text-gray-700" />
          )}
        </div>
      </button>
    </>
  )
}
