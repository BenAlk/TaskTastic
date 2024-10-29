import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

const DragDropWrapper = ({ onDragEnd, children }) => {
    const handleDragEnd = (result) => {
        if (onDragEnd && typeof onDragEnd === 'function') {
            onDragEnd(result);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {children}
        </DragDropContext>
    );
};

DragDropWrapper.propTypes = {
    onDragEnd: PropTypes.func,
    children: PropTypes.node
};

export default DragDropWrapper;
