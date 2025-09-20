'use client';

import { useState} from 'react';
import { motion} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Package, 
  MapPin, 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw,
  Home,
  Mail,
  Phone
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const TrackingNotFound = () => {
  const params = useParams();
  const router = useRouter();
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const invalidId = params?.id as string || 'Unknown';

  // Animation sequence
  const handleSearch = async () => {
    if (!searchId.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to the new tracking ID
    router.push(`/${searchId.trim()}`);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen pt-30  flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-muted-foreground mb-2"
          >
            Package Not Found
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            We couldn&#39;t locate the tracking information you&#39;re looking for
          </motion.p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="shadow-xl border-0 bg-white/5 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                Invalid Tracking ID
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Invalid ID Display */}
              <div className="p-4 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-500">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Searched ID:</span>
                </div>
                <p className="font-mono font-bold text-lg text-red-500 mt-1 break-all">
                  {invalidId}
                </p>
              </div>

              {/* Search New ID */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground block">
                  Try a different tracking ID:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tracking ID (e.g., TRX-202509-essential-44RYB7)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={!searchId.trim() || isSearching}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isSearching ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Helpful Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4  rounded-lg border border-blue-200">
                  <h3 className="font-medium mb-2">Common Issues:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Check for typos in the tracking ID</li>
                    <li>• Ensure all characters are included</li>
                    <li>• Remove any extra spaces</li>
                    <li>• Verify the ID is still active</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">Need Help?</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>Call: +234-XXX-XXX-XXXX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>Email: support@trackingapp.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                
                <Button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            Tracking IDs are usually sent via email or SMS when your package is shipped
          </p>
          
          {/* Example ID Format */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>Format: TRX-YYYYMM-description-XXXXX</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackingNotFound;