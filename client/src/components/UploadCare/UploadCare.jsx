import { Widget } from '@uploadcare/react-widget';

const AddImage = ({ setInputs }) => {
  return (
    <>
      <Widget
        publicKey="2b3b56fa1106c8cb9ec8"
        id="file"
        onFileSelect={(file) => {
          if (file) {
            file.progress((info) => {
              console.log('file progress: ', info.progress);
            });
            file.done((info) => {
              console.log('file uploaded: ', info.cdnUrl);
              setInputs((prevState) => {
                return { ...prevState, image: info.cdnUrl };
              });
              // navigate('/adminPanel');
              //   setInputs((prevState) => ({
              //     ...prevState,
              //     product_image: info.cdnUrl,
              //   }));
            });
          }
        }}
        onChange={(info) => {
          console.log('upload completed: ', info);
        }}
      />
    </>
  );
};

export default AddImage;
