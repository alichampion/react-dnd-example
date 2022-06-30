import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { ItemTypes } from './ItemTypes'

const wrapperStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  // cursor: 'move',
  width: 200,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
}

const handleStyle = {
  display: 'inline-block',
  marginRight: '0.75rem',
  cursor: 'move',
}

export interface CardProps {
  id: any
  text: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const Card: FC<CardProps> = ({ id, text, index, moveCard }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...wrapperStyles, opacity }} data-handler-id={handlerId}>
      <div ref={drag} style={handleStyle}>
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.125 11.4663C6.7769 11.4663 6.44306 11.6046 6.19692 11.8507C5.95078 12.0969 5.8125 12.4307 5.8125 12.7788C5.8125 13.1269 5.95078 13.4607 6.19692 13.7069C6.44306 13.953 6.7769 14.0913 7.125 14.0913C7.4731 14.0913 7.80694 13.953 8.05308 13.7069C8.29922 13.4607 8.4375 13.1269 8.4375 12.7788C8.4375 12.4307 8.29922 12.0969 8.05308 11.8507C7.80694 11.6046 7.4731 11.4663 7.125 11.4663ZM1.875 11.4663C1.5269 11.4663 1.19306 11.6046 0.946923 11.8507C0.700781 12.0969 0.5625 12.4307 0.5625 12.7788C0.5625 13.1269 0.700781 13.4607 0.946923 13.7069C1.19306 13.953 1.5269 14.0913 1.875 14.0913C2.2231 14.0913 2.55694 13.953 2.80308 13.7069C3.04922 13.4607 3.1875 13.1269 3.1875 12.7788C3.1875 12.4307 3.04922 12.0969 2.80308 11.8507C2.55694 11.6046 2.2231 11.4663 1.875 11.4663ZM0.5625 7.52881C0.5625 7.18071 0.700781 6.84687 0.946923 6.60073C1.19306 6.35459 1.5269 6.21631 1.875 6.21631C2.2231 6.21631 2.55694 6.35459 2.80308 6.60073C3.04922 6.84687 3.1875 7.18071 3.1875 7.52881C3.1875 7.87691 3.04922 8.21074 2.80308 8.45689C2.55694 8.70303 2.2231 8.84131 1.875 8.84131C1.5269 8.84131 1.19306 8.70303 0.946923 8.45689C0.700781 8.21074 0.5625 7.87691 0.5625 7.52881ZM7.125 6.21631C6.7769 6.21631 6.44306 6.35459 6.19692 6.60073C5.95078 6.84687 5.8125 7.18071 5.8125 7.52881C5.8125 7.87691 5.95078 8.21074 6.19692 8.45689C6.44306 8.70303 6.7769 8.84131 7.125 8.84131C7.4731 8.84131 7.80694 8.70303 8.05308 8.45689C8.29922 8.21074 8.4375 7.87691 8.4375 7.52881C8.4375 7.18071 8.29922 6.84687 8.05308 6.60073C7.80694 6.35459 7.4731 6.21631 7.125 6.21631ZM0.5625 2.27881C0.5625 1.93071 0.700781 1.59687 0.946923 1.35073C1.19306 1.10459 1.5269 0.966309 1.875 0.966309C2.2231 0.966309 2.55694 1.10459 2.80308 1.35073C3.04922 1.59687 3.1875 1.93071 3.1875 2.27881C3.1875 2.62691 3.04922 2.96074 2.80308 3.20689C2.55694 3.45303 2.2231 3.59131 1.875 3.59131C1.5269 3.59131 1.19306 3.45303 0.946923 3.20689C0.700781 2.96074 0.5625 2.62691 0.5625 2.27881ZM7.125 0.966309C6.7769 0.966309 6.44306 1.10459 6.19692 1.35073C5.95078 1.59687 5.8125 1.93071 5.8125 2.27881C5.8125 2.62691 5.95078 2.96074 6.19692 3.20689C6.44306 3.45303 6.7769 3.59131 7.125 3.59131C7.4731 3.59131 7.80694 3.45303 8.05308 3.20689C8.29922 2.96074 8.4375 2.62691 8.4375 2.27881C8.4375 1.93071 8.29922 1.59687 8.05308 1.35073C7.80694 1.10459 7.4731 0.966309 7.125 0.966309Z" fill="black"/>
          </svg>
      </div>
      <div style={style}>
        {text}
      </div>
    </div>
  )
}
