import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  ExternalLink, 
  Heart, 
  BookOpen, 
  Users, 
  Shield,
  Brain,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";

export default function ResourcesPage() {
  const emergencyContacts = [
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      description: "24/7 toll-free mental health helpline by Ministry of Social Justice",
      availability: "24/7"
    },
    {
      name: "Sneha India Foundation",
      number: "044-2464-0050",
      description: "Crisis intervention and suicide prevention",
      availability: "24/7"
    },
    {
      name: "Vandrevala Foundation",
      number: "9999-666-555",
      description: "Professional counseling and crisis support",
      availability: "24/7"
    }
  ];

  const resources = [
    {
      category: "Self-Help Apps",
      icon: Smartphone,
      color: "from-blue-400 to-cyan-500",
      items: [
        {
          title: "Calm",
          description: "Meditation and sleep stories",
          url: "https://www.calm.com"
        },
        {
          title: "Headspace",
          description: "Guided meditation and mindfulness",
          url: "https://www.headspace.com"
        },
        {
          title: "Youper",
          description: "AI emotional health assistant",
          url: "https://www.youper.ai"
        }
      ]
    },
    {
      category: "Educational Resources",
      icon: BookOpen,
      color: "from-green-400 to-teal-500",
      items: [
        {
          title: "Mental Health India",
          description: "Comprehensive information on mental health",
          url: "https://www.mentalhealthindia.org"
        },
        {
          title: "Live Love Laugh Foundation",
          description: "Deepika Padukone's mental health awareness platform",
          url: "https://www.thelivelovelaughfoundation.org"
        },
        {
          title: "Mind Matters",
          description: "Student mental health resources",
          url: "https://mindmatters.edu.au"
        }
      ]
    },
    {
      category: "Support Communities",
      icon: Users,
      color: "from-purple-400 to-pink-500",
      items: [
        {
          title: "7 Cups",
          description: "Free emotional support from trained listeners",
          url: "https://www.7cups.com"
        },
        {
          title: "IMALIVE",
          description: "Online crisis chat support",
          url: "https://www.imalive.org"
        },
        {
          title: "Reddit Mental Health",
          description: "Supportive communities and discussions",
          url: "https://www.reddit.com/r/mentalhealth"
        }
      ]
    }
  ];

  const selfCareActivities = [
    "Practice deep breathing for 5 minutes daily",
    "Write in a journal before bed",
    "Take a 10-minute walk outdoors",
    "Listen to your favorite music",
    "Call a friend or family member",
    "Practice gratitude - list 3 things you're thankful for",
    "Try progressive muscle relaxation",
    "Engage in a creative hobby",
    "Limit social media time",
    "Get adequate sleep (7-9 hours)",
    "Stay hydrated throughout the day",
    "Practice saying 'no' to overwhelming commitments"
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Mental Health Resources
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Curated resources, helplines, and tools to support your mental wellness journey
          </p>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Crisis Support Helplines</h2>
            <p className="text-gray-600">Immediate help when you need it most</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="glass-effect gentle-shadow border-0 hover:scale-[1.02] transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-500" />
                    {contact.name}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit bg-red-100 text-red-700">
                    {contact.availability}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600 mb-2">{contact.number}</p>
                  <p className="text-gray-600 text-sm">{contact.description}</p>
                  <Button
                    asChild
                    className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <a href={`tel:${contact.number}`}>Call Now</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Resource Categories */}
        {resources.map((category, categoryIndex) => (
          <motion.section
            key={categoryIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.category}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((item, index) => (
                <Card key={index} className="glass-effect gentle-shadow border-0 hover:scale-[1.02] transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-white/40 border-white/20 hover:bg-white/60"
                    >
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <span>Visit Resource</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Self-Care Activities */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Self-Care Activities</h2>
            <p className="text-gray-600">Simple practices to nurture your mental health</p>
          </div>

          <Card className="glass-effect gentle-shadow border-0 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {selfCareActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/30 rounded-lg">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="glass-effect gentle-shadow border-0">
            <CardContent className="text-center py-8">
              <Shield className="w-8 h-8 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Note</h3>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                This platform provides support and resources but is not a substitute for professional mental health care. 
                If you're experiencing severe symptoms or thoughts of self-harm, please contact emergency services 
                or the crisis helplines listed above immediately.
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}