import React from 'react'

export default function SectionTitle({ title = null, entry, children, className = '', hideMobile = false, ...props }) {
	return (
		<>
			<h2 {...props} className={(hideMobile ? 'hidden lg:block ' : '') + "title-section " + className}>{title || children}</h2>
			{entry && (<span className="mt-2 inline-block">{entry}</span>)}
		</>

	)
}
