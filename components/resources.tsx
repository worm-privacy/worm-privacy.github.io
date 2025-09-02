import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, FileText, Book, Twitter, ExternalLink } from "lucide-react"

export function Resources() {
  const resources = [
    {
      icon: Github,
      title: "WORM GitHub",
      description: "Open source contracts and zk-circuits",
      link: "https://github.com/worm-privacy",
      color: "text-gray-400",
    },
    {
      icon: FileText,
      title: "EIP-7503 Specification",
      description: "Private Proof-of-Burn standard",
      link: "https://eips.ethereum.org/EIPS/eip-7503",
      color: "text-blue-400",
    },
    {
      icon: Book,
      title: "ZK Circuit Documentation",
      description: "Technical implementation details",
      link: "https://github.com/worm-privacy/proof-of-burn",
      color: "text-purple-400",
    },
    {
      icon: Twitter,
      title: "Project Updates",
      description: "Latest news and announcements",
      link: "https://x.com/EIP7503",
      color: "text-cyan-400",
    },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Resources</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore the technical documentation, source code, and community resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => (
            <Card
              key={index}
              className="bg-green-950/30 border-green-800 hover:border-green-700 transition-all hover:scale-105 cursor-pointer"
            >
              <CardHeader className="text-center">
                <resource.icon className={`w-8 h-8 ${resource.color} mx-auto mb-2`} />
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                <a 
                  target="_blank" 
                  rel="nopener noreferrer" 
                  href={`${resource.link}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-300 hover:bg-green-900/50 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-700 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-green-300">
            <span className="font-mono">🪱 WORM</span> is where finality meets scarcity
          </h3>
          <p className="text-lg text-green-300 mb-6">Welcome to the burn economy</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/worm-privacy/miner">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-black font-semibold"
              >
                Start Burning ETH
              </Button>
            </a>
            <a href="https://t.me/+HYMJx8QmCBw1NWRk">
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-300 hover:bg-green-900/50 bg-transparent"
              >
                Join Telegram Group
              </Button>
            </a>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-green-800 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              <p>
                © 2025 <span className="font-mono text-green-400">WORM Protocol</span>. MIT License - Fully Open Source
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm font-mono">Built on Ethereum</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </footer>
      </div>
    </section >
  )
}
