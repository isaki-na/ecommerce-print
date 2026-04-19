import React from 'react'
import SectionTitle from './SectionTitle'

const SectionList = ({ children, title, entry, hideMobileTitle, titleClassName = '' }) => {
	return (
		<div className="py-content">
			<SectionTitle title={title} entry={entry} hideMobile={hideMobileTitle} className={titleClassName} />
			<div className="mt-8">
				{children}
			</div>
		</div>
	)
}

export default SectionList