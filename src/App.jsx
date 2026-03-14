import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, ExternalLink } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // In a real app, we might fetch this from an API
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedGame(null)}>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-zinc-950" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">UNBLOCKED ARCADE</span>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium hover:text-emerald-500 transition-colors hidden md:block">
                Categories
              </button>
              <button className="text-sm font-medium hover:text-emerald-500 transition-colors hidden md:block">
                New
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedGame ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <header>
              <h1 className="text-3xl font-bold tracking-tight">Featured Games</h1>
              <p className="text-zinc-500 mt-1">Hand-picked classics for your break.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -5 }}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-emerald-500 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                      {game.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500">No games found matching your search.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col gap-4 ${isFullScreen ? 'fixed inset-0 z-50 bg-zinc-950 p-0' : ''}`}
          >
            <div className={`flex items-center justify-between ${isFullScreen ? 'p-4 bg-zinc-900' : ''}`}>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                  {!isFullScreen && (
                    <p className="text-sm text-zinc-500">{selectedGame.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullScreen}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <a
                  href={selectedGame.iframeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className={`relative bg-black rounded-2xl overflow-hidden border border-white/5 ${isFullScreen ? 'flex-1 rounded-none border-none' : 'aspect-video w-full'}`}>
              <iframe
                src={selectedGame.iframeUrl}
                className="w-full h-full border-none"
                allow="fullscreen"
                title={selectedGame.title}
              />
            </div>

            {!isFullScreen && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">More Games</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {games.filter(g => g.id !== selectedGame.id).map(game => (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="flex-shrink-0 w-48 group cursor-pointer"
                    >
                      <div className="aspect-video rounded-xl overflow-hidden border border-white/5 mb-2">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-sm font-medium group-hover:text-emerald-500 transition-colors truncate">
                        {game.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500 rounded">
                <Gamepad2 className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-bold tracking-tight">UNBLOCKED ARCADE</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-zinc-600">
              © 2026 Unblocked Arcade. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
