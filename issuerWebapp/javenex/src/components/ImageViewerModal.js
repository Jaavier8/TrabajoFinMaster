// Material
import { Modal } from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

import ImageViewer from 'react-simple-image-viewer';

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
}));

export default function ImageViewerModal(props) {
    const { show, onClose, images, currentImage } = props;

    return (
        <Modal
            open={show}
            onClose={() => {
                onClose();
            }}
            onBackdropClick={() => {
                onClose();
            }}
        >
            <RootStyle>
                <ImageViewer
                    src={images}
                    currentIndex={currentImage}
                    onClose={onClose}
                    disableScroll={false}
                    closeOnClickOutside={true}
                    backgroundStyle={{
                        backgroundColor: "rgba(0,0,0,0.6)"
                    }}
                />
            </RootStyle>
        </Modal>
    );
}

