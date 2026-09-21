import Link from "next/link";
import { MapPin, Plus, HelpCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BiharLand</h1>
              <p className="text-xs text-slate-300">ZameenSetu - Rohtas District</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition text-sm font-medium"
            >
              Explore
            </Link>
            <Link
              href="/list-land"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Sell Land
            </Link>
            <button
              className="text-slate-300 hover:text-white transition"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
