/**
 * Footer Component
 * Professional footer with developer information and links
 */

import { Mail, Github, Linkedin, Phone, MapPin, Code2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Shashi Bhushan Kumar
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              BTech Computer Science Student at IIIT Senapati, Manipur
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Full-stack MERN Developer with expertise in building scalable web applications
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>IIIT Senapati, Manipur</span>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:shashibhushan847305@gmail.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>shashibhushan847305@gmail.com</span>
              </a>
              <a 
                href="tel:+917782899732" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91-7782899732</span>
              </a>
            </div>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="space-y-3">
              <a 
                href="https://github.com/Git-Shashi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Profile</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/shashi-bhushan-kumar-796b53259/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Bar */}
        <div className="text-sm text-muted-foreground text-center">
          <p>© {currentYear} Shashi Bhushan Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
