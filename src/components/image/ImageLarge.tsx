import { IMAGE_WIDTH_LARGE, ImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageLarge(props: ImageProps) {
  const { aspectRatio, blurCompatibilityMode, ...rest } = props;

  const handleBuy = () => {
    // Replace this with your marketplace URL or smart contract logic
    window.open(`https://marketplace.com/nft/${rest.id}`, '_blank');
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <ImageWithFallback
        {...{
          ...rest,
          blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
          width: IMAGE_WIDTH_LARGE,
          height: Math.round(IMAGE_WIDTH_LARGE / aspectRatio),
        }}
      />
      {/* Add the "Buy Now" Button */}
      <button
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onClick={handleBuy}
      >
        Buy Now
      </button>
    </div>
  );
}
