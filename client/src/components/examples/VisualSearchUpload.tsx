import { VisualSearchUpload } from '../VisualSearchUpload';

export default function VisualSearchUploadExample() {
  return (
    <div className="p-4">
      <VisualSearchUpload
        onImageUpload={(file) => console.log('Image uploaded:', file.name)}
        isLoading={false}
      />
    </div>
  );
}
