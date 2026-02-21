import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ChatApp from "./components/ChatApp";

export default function Home() {
  return (
    <div className="h-screen">
      <SignedOut>
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50">
          <div className="text-center space-y-6 p-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-500 p-6 rounded-full shadow-lg">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800">Live Chat</h1>
            <p className="text-gray-600 text-lg max-w-md">Connect with friends and family instantly with real-time messaging</p>
            <SignInButton mode="modal">
              <button className="bg-teal-500 text-white px-8 py-4 rounded-full hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg">
                Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <ChatApp />
      </SignedIn>
    </div>
  );
}
