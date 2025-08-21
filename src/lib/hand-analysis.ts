import { pipeline, env } from '@huggingface/transformers';
import { HandAnalysis } from '@/types/palmistry';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let imageClassifier: any = null;

export const initializeHandAnalysis = async () => {
  if (!imageClassifier) {
    try {
      imageClassifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.log('WebGPU not available, falling back to CPU');
      imageClassifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50'
      );
    }
  }
  return imageClassifier;
};

export const analyzeHandImage = async (imageElement: HTMLImageElement): Promise<HandAnalysis> => {
  try {
    // Initialize the classifier if needed
    await initializeHandAnalysis();
    
    // Convert image to canvas for analysis
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image for analysis
    const maxSize = 512;
    let { width, height } = imageElement;
    
    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, width, height);
    
    // Analyze basic hand features using image processing
    const analysis = analyzeHandFeatures(imageData, width, height);
    
    return analysis;
  } catch (error) {
    console.error('Hand analysis error:', error);
    // Return random analysis as fallback
    return generateRandomHandAnalysis();
  }
};

const analyzeHandFeatures = (imageData: ImageData, width: number, height: number): HandAnalysis => {
  const data = imageData.data;
  
  // Basic image analysis techniques
  let edgeCount = 0;
  let brightPixels = 0;
  let totalIntensity = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const intensity = (r + g + b) / 3;
    totalIntensity += intensity;
    
    if (intensity > 200) brightPixels++;
    
    // Simple edge detection
    if (i > width * 4 && i < data.length - width * 4) {
      const prevRow = (data[i - width * 4] + data[i - width * 4 + 1] + data[i - width * 4 + 2]) / 3;
      const nextRow = (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3;
      
      if (Math.abs(intensity - prevRow) > 30 || Math.abs(intensity - nextRow) > 30) {
        edgeCount++;
      }
    }
  }
  
  const avgIntensity = totalIntensity / (data.length / 4);
  const edgeRatio = edgeCount / (data.length / 4);
  const brightRatio = brightPixels / (data.length / 4);
  
  // Map image characteristics to palm features
  const palmSize = width * height > 300000 ? 'large' : width * height > 150000 ? 'medium' : 'small';
  const fingerLength = height > width * 1.3 ? 'long' : height > width * 1.1 ? 'medium' : 'short';
  
  return {
    palmSize,
    fingerLength,
    lifeLine: {
      length: edgeRatio > 0.15 ? 'long' : edgeRatio > 0.10 ? 'medium' : 'short',
      depth: avgIntensity < 100 ? 'deep' : avgIntensity < 150 ? 'medium' : 'shallow',
      curvature: brightRatio > 0.3 ? 'very_curved' : brightRatio > 0.2 ? 'curved' : 'straight'
    },
    heartLine: {
      position: avgIntensity > 180 ? 'high' : avgIntensity > 120 ? 'medium' : 'low',
      length: edgeCount > 1000 ? 'long' : edgeCount > 500 ? 'medium' : 'short',
      branches: Math.floor(edgeRatio * 10)
    },
    headLine: {
      slope: brightRatio > 0.4 ? 'steep' : brightRatio > 0.2 ? 'sloped' : 'horizontal',
      length: Math.abs(width - height) < 50 ? 'long' : Math.abs(width - height) < 100 ? 'medium' : 'short',
      clarity: edgeRatio > 0.12 ? 'clear' : edgeRatio > 0.08 ? 'faint' : 'broken'
    },
    fateLine: {
      present: edgeCount > 800,
      clarity: edgeCount > 1200 ? 'strong' : edgeCount > 600 ? 'weak' : 'absent',
      position: width > height ? 'right' : width < height ? 'left' : 'center'
    }
  };
};

const generateRandomHandAnalysis = (): HandAnalysis => {
  const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  return {
    palmSize: randomChoice(['small', 'medium', 'large']),
    fingerLength: randomChoice(['short', 'medium', 'long']),
    lifeLine: {
      length: randomChoice(['short', 'medium', 'long']),
      depth: randomChoice(['shallow', 'medium', 'deep']),
      curvature: randomChoice(['straight', 'curved', 'very_curved'])
    },
    heartLine: {
      position: randomChoice(['high', 'medium', 'low']),
      length: randomChoice(['short', 'medium', 'long']),
      branches: Math.floor(Math.random() * 5)
    },
    headLine: {
      slope: randomChoice(['horizontal', 'sloped', 'steep']),
      length: randomChoice(['short', 'medium', 'long']),
      clarity: randomChoice(['clear', 'faint', 'broken'])
    },
    fateLine: {
      present: Math.random() > 0.3,
      clarity: randomChoice(['strong', 'weak', 'absent']),
      position: randomChoice(['center', 'left', 'right'])
    }
  };
};