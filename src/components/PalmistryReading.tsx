import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/palmistry-hero.jpg';
import { Camera, Upload, Sparkles, Heart, DollarSign, Briefcase, Activity, Clock, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo, PalmReading, HandAnalysis } from '@/types/palmistry';
import { analyzeHandImage } from '@/lib/hand-analysis';
import { generateAIPalmReading } from '@/lib/palmistry-ai';

const PalmistryReading = () => {
  const [step, setStep] = useState<'welcome' | 'userInfo' | 'lifeAspect' | 'capture' | 'reading'>('welcome');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    gender: '',
    dominantHand: '',
    lifeAspect: ''
  });
  const [handImage, setHandImage] = useState<string | null>(null);
  const [reading, setReading] = useState<PalmReading | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHandImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeHand = async () => {
    if (!handImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Create image element for analysis
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = handImage;
      });
      
      // Analyze hand features using computer vision
      const handAnalysis = await analyzeHandImage(img);
      
      // Generate AI-powered reading
      const aiReading = await generateAIPalmReading({
        userInfo,
        handAnalysis,
        timestamp: Date.now()
      });
      
      setReading(aiReading);
      setStep('reading');
      
      toast({
        title: "လက္ခဏာဖတ်ပြီးပါပြီ!",
        description: "AI ဆန်းစစ်ချက် အပြီးသတ်ပါပြီ",
      });
      
    } catch (error) {
      console.error('Hand analysis failed:', error);
      
      // Fallback to basic reading
      const fallbackReading = await generateBasicReading();
      setReading(fallbackReading);
      setStep('reading');
      
      toast({
        title: "လက္ခဏာဖတ်ပြီးပါပြီ!",
        description: "ပုံမှန် ဆန်းစစ်ချက် အသုံးပြုထားပါသည်",
        variant: "default"
      });
    }
    
    setIsAnalyzing(false);
  };

  const generateBasicReading = async (): Promise<PalmReading> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const age = parseInt(userInfo.age);
    const aspectReadings = {
      business: {
        lifeLine: age < 30 ? "စီးပွားရေးမှာ အခွင့်အလမ်းကောင်းတွေ ရရှိမယ်" : "လုပ်ငန်း တည်ငြိမ်မှုနဲ့ အောင်မြင်မှု ရှိမယ်",
        heartLine: "စီးပွားရေး မိတ်ဖက်တွေနဲ့ ယုံကြည်မှုရှိမယ်",
        headLine: "လုပ်ငန်း ဆုံးဖြတ်ချက်တွေမှာ ပညာရှိမှု ရှိမယ်",
        fateLine: "ကြိုးစားမှုတွေက စီးပွားရေး အောင်မြင်မှု ယူဆောင်လာမယ်",
        timeframe: "လာမယ့် ၆ လအတွင်း စီးပွားရေး အပြောင်းအလဲ ကောင်းတွေ ရှိမယ်",
        advice: "လုပ်ငန်းမှာ သေချာမှုနဲ့ ဆုံးဖြတ်ပြီး အရင်းအမြစ် စုဆောင်းပါ"
      },
      education: {
        lifeLine: "ပညာရေးမှာ အောင်မြင်မှုတွေ ရရှိမယ်",
        heartLine: "ဆရာများနဲ့ မိတ်ဆွေများမှ အကူအညီ ရရှိမယ်", 
        headLine: "သင်ယူနိုင်စွမ်း မြင့်မားပြီး ဗဟုသုတ ကျယ်ပြန့်မယ်",
        fateLine: "ပညာရေးက အနာဂတ် အောင်မြင်မှု ဖန်တီးပေးမယ်",
        timeframe: "လာမယ့် ၃ လအတွင်း ပညာရေး ပိုမို တိုးတက်မယ်",
        advice: "နေ့စဉ် သင်ယူမှုကို ပုံမှန်လုပ်ပြီး စိတ်ရှည်သီးခံပါ"
      },
      health: {
        lifeLine: "ကျန်းမာရေး ကောင်းမွန်ပြီး ရောဂါကင်းမယ်",
        heartLine: "စိတ်ကျန်းမာရေး တည်ငြိမ်မယ်",
        headLine: "ကျန်းမာရေး စောင့်ရှောက်မှုမှာ ပညာရှိမှုရှိမယ်",
        fateLine: "ကျန်းမာရေး ရေရှည် ကောင်းမွန်မယ်",
        timeframe: "လာမယ့် ၂ လအတွင်း ကျန်းမာရေး သိသာစွာ ကောင်းလာမယ်",
        advice: "နေ့စဉ် ကာယကံ့ခိုင်ရေးလုပ်ပြီး စိတ်ဖိစီးမှု လျှော့ချပါ"
      },
      love: {
        lifeLine: userInfo.gender === 'female' ? "အချစ်ရေးမှာ ခံစားမှု ပြည့်ဝမယ်" : "ဇနီးမောင်နှံ ဆက်ဆံရေး ကောင်းမယ်",
        heartLine: "နှလုံးသား လိုချင်တာကို တွေ့ရမယ်",
        headLine: "အချစ်ရေး ဆုံးဖြတ်ချက်တွေ ပညာရှိမယ်", 
        fateLine: "အချစ်ရေးက ဘဝကို ပိုမို ပြည့်စုံစေမယ်",
        timeframe: age < 30 ? "လာမယ့် ၄ လအတွင်း အချစ်ရေး အပြောင်းအလဲ ရှိမယ်" : "လာမယ့် ၆ လအတွင်း မိသားစု ပျော်ရွှင်မှု ရှိမယ်",
        advice: "အချစ်ရေးမှာ ရိုးသားမှု ထားပြီး စိတ်ခံစားမှုတွေ ပွင့်လင်းစွာ ဖော်ပြပါ"
      }
    };
    
    const selectedReadings = aspectReadings[userInfo.lifeAspect as keyof typeof aspectReadings] || aspectReadings.business;
    
    return {
      ...selectedReadings,
      overall: `${userInfo.name}ရဲ့ လက်ဝါးမှာ ${getAspectName(userInfo.lifeAspect)}နဲ့ ပတ်သက်ပြီး ကောင်းမွန်တဲ့ လက္ခဏာတွေ တွေ့ရတယ်။ အသက် ${age} နှစ်မှာ သင့်အတွက် အရေးကြီးတဲ့ အချိန်ကာလ ရောက်နေပြီ။`,
      luckyNumbers: [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1],
      luckyColors: ['ရွှေရောင်', 'အပြာရောင်']
    };
  };

  const getAspectName = (aspect: string) => {
    const names = {
      business: 'စီးပွားရေး',
      education: 'ပညာရေး', 
      health: 'ကျန်းမာရေး',
      love: 'အချစ်ရေး'
    };
    return names[aspect as keyof typeof names] || 'ဘဝ';
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-card-gradient border-primary/20 shadow-mystical">
          <CardHeader className="text-center space-y-6">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <img 
                src={heroImage} 
                alt="Myanmar Palmistry" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-golden text-primary-foreground px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  မြန်မာ့လက္ခဏာ ဗေဒင်
                </Badge>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              လက္ခဏာဖတ်ခြင်း
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              ရှေးယခင်ကတည်းက ဆင်းသက်လာတဲ့ မြန်မာ့လက္ခဏာ ဗေဒင်ပညာဖြင့် သင့်အနာဂတ်ကို ဟောကြားပေးပါမယ်
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-secondary/50">
                <Heart className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">အချစ်ရေး</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">အလုပ်အကိုင်</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">ငွေကြေးကံကြမ္မာ</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <Activity className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">ကျန်းမာရေး</p>
              </div>
            </div>
            <Button 
              onClick={() => setStep('userInfo')} 
              className="w-full bg-golden hover:bg-primary/90 text-primary-foreground font-medium py-3 shadow-golden"
            >
              လက္ခဏာဖတ်ခြင်း စတင်မယ်
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'userInfo') {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card-gradient border-primary/20 shadow-mystical">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">သင့်အကြောင်း ပြောပြပါ</CardTitle>
            <CardDescription>
              တကယ့် ဗေဒင်ဆရာတွေလို သင့်အကြောင်း သိချင်ပါတယ်
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">အမည်</Label>
              <Input 
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({...prev, name: e.target.value}))}
                placeholder="သင့်အမည်ထည့်ပါ"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">အသက်</Label>
              <Input 
                id="age"
                type="number"
                value={userInfo.age}
                onChange={(e) => setUserInfo(prev => ({...prev, age: e.target.value}))}
                placeholder="အသက်ထည့်ပါ"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>လိင်</Label>
              <Select onValueChange={(value) => setUserInfo(prev => ({...prev, gender: value}))}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="လိင်ရွေးပါ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ကျား</SelectItem>
                  <SelectItem value="female">မ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>အဓိကအသုံးပြုတဲ့လက်</Label>
              <Select onValueChange={(value) => setUserInfo(prev => ({...prev, dominantHand: value}))}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="လက်ရွေးပါ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">ညာလက်</SelectItem>
                  <SelectItem value="left">ဝဲလက်</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => setStep('lifeAspect')} 
              disabled={!userInfo.name || !userInfo.age || !userInfo.gender || !userInfo.dominantHand}
              className="w-full bg-golden hover:bg-primary/90 text-primary-foreground font-medium py-3 shadow-golden"
            >
              နောက်တစ်ဆင့်သွားမယ်
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'lifeAspect') {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card-gradient border-primary/20 shadow-mystical">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">ဘယ်အရာကို သိချင်လဲ?</CardTitle>
            <CardDescription>
              သင်သိချင်တဲ့ ဘဝရဲ့ ကဏ္ဍကို ရွေးပါ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserInfo(prev => ({...prev, lifeAspect: 'business'}))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userInfo.lifeAspect === 'business' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="font-medium text-foreground">စီးပွားရေး</p>
                <p className="text-xs text-muted-foreground">အလုပ်အကိုင်</p>
              </button>
              
              <button
                onClick={() => setUserInfo(prev => ({...prev, lifeAspect: 'education'}))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userInfo.lifeAspect === 'education' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="w-8 h-8 mx-auto mb-2 text-accent flex items-center justify-center">
                  📚
                </div>
                <p className="font-medium text-foreground">ပညာရေး</p>
                <p className="text-xs text-muted-foreground">ပညာသင်ကြား</p>
              </button>
              
              <button
                onClick={() => setUserInfo(prev => ({...prev, lifeAspect: 'health'}))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userInfo.lifeAspect === 'health' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Activity className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="font-medium text-foreground">ကျန်းမာရေး</p>
                <p className="text-xs text-muted-foreground">ရောဂါကင်းရေး</p>
              </button>
              
              <button
                onClick={() => setUserInfo(prev => ({...prev, lifeAspect: 'love'}))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userInfo.lifeAspect === 'love' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Heart className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="font-medium text-foreground">အချစ်ရေး</p>
                <p className="text-xs text-muted-foreground">ခွန်းခြင်မေတ္တာ</p>
              </button>
            </div>
            
            <Button 
              onClick={() => setStep('capture')} 
              disabled={!userInfo.lifeAspect}
              className="w-full bg-golden hover:bg-primary/90 text-primary-foreground font-medium py-3 shadow-golden"
            >
              လက်ဝါးဓာတ်ပုံ ရိုက်မယ်
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'capture') {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-card-gradient border-primary/20 shadow-mystical">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">လက်ဝါးဓာတ်ပုံ ရိုက်ပါ</CardTitle>
            <CardDescription>
              {userInfo.dominantHand === 'right' ? 'ညာလက်ဝါး' : 'ဝဲလက်ဝါး'}ကို ကြည့်လိုက်မယ်
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!handImage ? (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <Camera className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-muted-foreground">
                    လက်ဝါးကို အောက်ဖက်မျက်နှာမူပြီး ရှင်းရှင်းလင်းလင်း ရိုက်ပါ
                  </p>
                  <div className="flex gap-3">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageCapture}
                        className="hidden"
                      />
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Camera className="w-4 h-4 mr-2" />
                        ကင်မရာဖွင့်
                      </Button>
                    </label>
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageCapture}
                        className="hidden"
                      />
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        ပုံရွေး
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={handImage} 
                    alt="Hand" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setHandImage(null)}
                    className="flex-1"
                  >
                    ပြန်ရိုက်
                  </Button>
                  <Button 
                    onClick={analyzeHand}
                    disabled={isAnalyzing}
                    className="flex-1 bg-golden hover:bg-primary/90 text-primary-foreground shadow-golden"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        AI ဆန်းစစ်နေ...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        လက္ခဏာဖတ်
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'reading' && reading) {
    return (
      <div className="min-h-screen bg-mystical py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card-gradient border-primary/20 shadow-mystical">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-primary">
                {userInfo.name}ရဲ့ လက္ခဏာဖတ်ချက်
              </CardTitle>
              <CardDescription className="text-lg">
                AI ပေါင်းစပ် မြန်မာ့ဗေဒင်ပညာ ဟောကြားချက်
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-secondary/30 rounded-lg mb-6">
                <p className="text-lg text-foreground leading-relaxed">
                  {reading.overall}
                </p>
              </div>
              
              {/* Timeframe and Advice */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 mr-2 text-accent" />
                    <h4 className="font-semibold text-foreground">အချိန်ကာလ</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{reading.timeframe}</p>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-semibold text-foreground">အကြံပြုချက်</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{reading.advice}</p>
                </div>
              </div>

              {/* Lucky Elements */}
              {(reading.luckyNumbers || reading.luckyColors) && (
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                  {reading.luckyNumbers && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">ကံကောင်းဂဏန်းများ</p>
                      <div className="flex gap-2">
                        {reading.luckyNumbers.map((num, idx) => (
                          <Badge key={idx} className="bg-golden text-primary-foreground">
                            {num}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {reading.luckyColors && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">ကံကောင်းရောင်များ</p>
                      <div className="flex gap-2 flex-wrap">
                        {reading.luckyColors.map((color, idx) => (
                          <Badge key={idx} variant="outline" className="text-accent border-accent">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card-gradient border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <Activity className="w-5 h-5 mr-2" />
                  အသက်မျဉ်း (Life Line)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{reading.lifeLine}</p>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <Heart className="w-5 h-5 mr-2" />
                  နှလုံးမျဉ်း (Heart Line)  
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{reading.heartLine}</p>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <Briefcase className="w-5 h-5 mr-2" />
                  ဦးနှောက်မျဉ်း (Head Line)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{reading.headLine}</p>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <DollarSign className="w-5 h-5 mr-2" />
                  ကံကြမ္မာမျဉ်း (Fate Line)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{reading.fateLine}</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => {
                setStep('welcome');
                setUserInfo({name: '', age: '', gender: '', dominantHand: '', lifeAspect: ''});
                setHandImage(null);
                setReading(null);
              }}
              className="bg-golden hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 shadow-golden"
            >
              ပြန်စမယ်
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PalmistryReading;