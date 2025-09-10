import React from 'react'
import './SkeletonScreen.css'

function SkeletonScreen() {
  return (
    <div className="glass-card">
      {/* Skeleton content styled to mimic actual layout */}
      <div className="skeleton-line" style={{ width: '70%', height: '24px', marginBottom: '16px', backgroundColor: '#ccc', borderRadius: '4px' }} />
      <div className="skeleton-line" style={{ width: '60%', height: '24px', backgroundColor: '#ccc', borderRadius: '4px' }} />
    </div>
  )
}

export default SkeletonScreen