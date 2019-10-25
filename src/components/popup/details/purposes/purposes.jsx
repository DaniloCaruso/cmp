import { h, createRef, Component } from 'preact';
import style from './purposes.less';
import Switch from '../../../switch/switch';
import Label from '../../../label/label';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Purposes extends Component {
	state = {
		selectedPurposeIndex: 0,
		selectedPurposeIdList: {
			0: false,
			1: false,
			2: false,
			3: false, 
			4: false, 
			5: false, 
			6: false, 
			7: false, 
			8: false
		},
		localVendors: {
			0: [],
			1: [],
			2: [],
			3: [], 
			4: [], 
			5: [], 
			6: [], 
			7: [], 
			8: []
		},
		showLocalVendors: {
			0: false,
			1: false,
			2: false,
			3: false, 
			4: false, 
			5: false, 
			6: false, 
			7: false, 
			8: false
		}
	};

	static defaultProps = {
		onShowVendors: () => {},
		purposes: [],
		customPurposes: [],
		selectedPurposeIds: new Set(),
		selectedCustomPurposeIds: new Set()
	};

	handleSelectPurposeDetail = (index) => {
		let updatedSelection = { ...this.state.selectedPurposeIdList };
		updatedSelection[index] = !updatedSelection[index];

		this.setState({
			selectedPurposeIndex: index,
			selectedPurposeIdList: updatedSelection
		}, this.props.updateCSSPrefs);
	};

	handleSelectPurpose = ({isSelected, dataId}) => {
		const {
			purposes,
			customPurposes,
			selectPurpose,
			selectCustomPurpose,
			updateCSSPrefs
		} = this.props;

		const allPurposes = [...purposes, ...customPurposes];
		const id = allPurposes[dataId].id;

		if (dataId < purposes.length) {
			selectPurpose(id, isSelected);
		} else {
			selectCustomPurpose(id, isSelected);
		}
	};

	onShowLocalVendors = (index = this.state.selectedPurposeIndex) => {
		const { localVendors, showLocalVendors } = this.state;
		const { vendors, updateCSSPrefs } = this.props;
		
		const localVendorList = vendors.map((vendor) => {
			let purposeId = index + 1;
			if (	vendor.purposeIds.indexOf(purposeId) !== -1 ||
						vendor.legIntPurposeIds.indexOf(purposeId) !== -1 ) return vendor;
		}).filter((vendor) => vendor);

		let updatedLocalVendors = { ...localVendors };
		updatedLocalVendors[index] = localVendorList;

		let updatedShowLocalVendors = { ...showLocalVendors };
		updatedShowLocalVendors[index] = true;

		this.setState({
			localVendors: updatedLocalVendors,
			showLocalVendorss: updatedShowLocalVendors
		}, () => { this.setState({ localVendors: updatedLocalVendors, showLocalVendors: updatedShowLocalVendors }) });
	};

	onHideLocalVendors = (index) => {
		const { showLocalVendors, localVendors } = this.state;
		let updatedShowLocalVendors = { ...showLocalVendors };
		updatedShowLocalVendors[index] = false;

		let updatedLocalVendors = { ...localVendors };
		updatedLocalVendors[index] = [];

		this.setState({
			showLocalVendors: updatedShowLocalVendors,
			localVendors: updatedLocalVendors
		});
	};

	componentDidUpdate() {
		this.props.updateCSSPrefs();
	}

	componentDidMount() {
		this.props.updateCSSPrefs();
	};

	render(props, state) {
		const {
			onShowVendors,
			purposes,
			features,
			customPurposes,
			selectedPurposeIds,
			selectedCustomPurposeIds,
			localization,
			config,
		} = props;

		const {
			selectedPurposeIndex,
			showLocalVendors,
			selectedPurposeIdList,
		} = state;
		let {
			localVendors
		} = state;

		const allPurposes = [...purposes, ...customPurposes];
		const selectedPurpose = allPurposes[selectedPurposeIndex];
		const selectedPurposeId = selectedPurpose && selectedPurpose.id;
		const currentPurposeLocalizePrefix = `${selectedPurposeIndex >= purposes.length ? 'customPurpose' : 'purpose'}${selectedPurposeId}`;
		let purposeIsActive = selectedPurposeIndex < purposes.length ?
			selectedPurposeIds.has(selectedPurposeId) :
			selectedCustomPurposeIds.has(selectedPurposeId);

		let selectedPurposesList = Object.keys(selectedPurposeIdList).map((_, purposeId) => allPurposes[purposeId]);
		let selectedPurposesIds = selectedPurposesList.map((_, index) => {
			return selectedPurposeIdList[index] ? selectedPurposesList[index].id : -1;
		});

		let purposeLocalizePrefixes = selectedPurposesIds.map((selectedId, index) => {
			return selectedId > -1 ? (selectedId >= purposes.length ? `customPurpose${selectedId}` : `purpose${selectedId}`) : '';
		});

		let purposesAreActive = selectedPurposesIds.map((id, index) => {
			if (id > -1) {
				return index < purposes.length ? selectedPurposeIds.has(id) : selectedCustomPurposeIds.has(id);
			} else {
				return false;
			}
		});

		return (
			<div class={style.container} >
				<div class={style.disclaimer + " primaryText"}>
					<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.disclaimer : ''} localizeKey='disclaimer'>We and selected companies may access and use information for the purposes outlined. You may customise your choice or continue using our site if you are OK with the purposes. You can see the </LocalLabel>
					<a class={style.vendorLink} onClick={onShowVendors}>
						<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.disclaimerVendorLink : ''} localizeKey='disclaimerVendorLink'>complete list of companies here.</LocalLabel>
					</a>
				</div>
				<div class={style.purposes}>
					<div class={style.purposeList}>
						{allPurposes.map((purpose, index) => {

						const ref = createRef();
						const handleClick = () =>
						  ref.current.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
						});

						return (
							<div class={[style.purposeItem, window.outerWidth >= 812 ? (selectedPurposeIndex === index ? style.selectedPurpose : '') : (selectedPurposeIdList[index] === true ? style.selectedPurpose : '')].join(' ')}>
								<input type="checkbox" id={`collapsible${index}`} name="purposeSelection" onClick={handleClick} />
								<label class={style.labelWrapper} for={`collapsible${index}`} ref={ref} onClick={() => this.handleSelectPurposeDetail(index)}>
									<LocalLabel localizeKey={`${index >= purposes.length ? 'customPurpose' : 'purpose'}${purpose.id}.menu`}>{purpose.name}</LocalLabel>
								</label>
							
								<div class={style.collapsibleContent}>
									<div class={style.contentInner}>
										<div class={style.purposeDescription}>
											<div class={style.purposeDetail + " primaryText"}>
												<div class={style.detailHeader}>
													<div class={style.title}>
														<LocalLabel localizeKey={`${purposeLocalizePrefixes[index]}.title`}>{selectedPurposesList[index].name}</LocalLabel>
													</div>
												</div>

												<div class={style.body}>
													<p><LocalLabel providedValue={selectedPurposesList[index].description} localizeKey={`${purposeLocalizePrefixes[index]}.description`} /></p>
													<p><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.featureHeader : ''} localizeKey='featureHeader'>This will include the following features:</LocalLabel></p>
													<ul>
													{features.map((feature, index) => (
														<li><LocalLabel class='featureItem' providedValue={feature.description} /></li>
													))}
													</ul>
													<div class={style.switchWrap}>
														<div class={style.active}>
															<Switch
																isSelected={purposesAreActive[index]}
																onClick={this.handleSelectPurpose}
																dataId={index}
															/>
															{purposesAreActive[index] &&
																<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.active : ''} localizeKey='active'>Active</LocalLabel>
															}
															{!purposesAreActive[index] &&
																<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.inactive : ''} localizeKey='inactive'>Inactive</LocalLabel>
															}
														</div>
														<span class={style.switchText}>
															<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.switchText : ''} localizeKey="switchText">Publisher and their partners could collect anonymized information in order to improve your experience on our site.</LocalLabel>
														</span>
													</div>
													{!showLocalVendors[index] &&
													<a class={style.vendorLink} onClick={() => this.onShowLocalVendors(index)}>
														<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.showVendors : ''} localizeKey='showVendors'>Show companies</LocalLabel>
													</a>
													}
													{showLocalVendors[index] &&
													<a class={style.vendorLink} onClick={() => this.onHideLocalVendors(index)}>
														<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.hideVendors : ''} localizeKey='hideVendors'>Hide companies</LocalLabel>
													</a>
													}
													{showLocalVendors[index] &&
														(<div>
															<div class={style.vendorHeader}>
																<table class={style.vendorList}>
																	<thead>
																	<tr>
																		<th><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.company : ''} localizeKey='company'>Company</LocalLabel></th>
																	</tr>
																	</thead>
																</table>
															</div>
															<div class={style.vendorContent}>
																<table class={style.vendorList}>
																	<tbody>
																	{localVendors[index].map(({name, policyUrl}, index) => (
																		<tr key={index + name} class={index % 2 === 1 ? style.even : ''}>
																			<td><a href={policyUrl} target='_blank'><div class={style.vendorName}>{name}</div></a></td>
																		</tr>
																	))}
																	</tbody>
																</table>
															</div>
														</div>)
													}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)})}
					</div>
					
					{selectedPurpose && 
						<div class={style.purposeWrapper}>
							<div class={style.purposeDescription}>
								<div class={style.purposeDetail + " primaryText"}>
									<div class={style.detailHeader}>
										<div class={style.title}>
											<LocalLabel localizeKey={`${currentPurposeLocalizePrefix}.title`}>{selectedPurpose.name}</LocalLabel>
										</div>
									</div>

									<div class={style.body}>
										<p><LocalLabel providedValue={selectedPurpose.description} localizeKey={`${currentPurposeLocalizePrefix}.description`} /></p>
										<p><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.featureHeader : ''} localizeKey='featureHeader'>This will include the following features:</LocalLabel></p>
										<ul>
										{features.map((feature, index) => (
											<li><LocalLabel class='featureItem' providedValue={feature.description} /></li>
										))}
										</ul>
										<div class={style.switchWrap}>
											<div class={style.active}>
												<Switch
													isSelected={purposeIsActive}
													onClick={this.handleSelectPurpose}
													dataId={selectedPurposeIndex}
												/>
												{purposeIsActive &&
													<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.active : ''} localizeKey='active'>Active</LocalLabel>
												}
												{!purposeIsActive &&
													<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.inactive : ''} localizeKey='inactive'>Inactive</LocalLabel>
												}
											</div>
											<span class={style.switchText}>
												<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.switchText : ''} localizeKey="switchText">Publisher and their partners could collect anonymized information in order to improve your experience on our site.</LocalLabel>
											</span>
										</div>
										{!showLocalVendors[selectedPurposeIndex] &&
										<a class={style.vendorLink} onClick={() => this.onShowLocalVendors(selectedPurposeIndex)}>
											<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.showVendors : ''} localizeKey='showVendors'>Show companies</LocalLabel>
										</a>
										}
										{showLocalVendors[selectedPurposeIndex] &&
										<a class={style.vendorLink} onClick={() => this.onHideLocalVendors(selectedPurposeIndex)}>
											<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.hideVendors : ''} localizeKey='hideVendors'>Hide companies</LocalLabel>
										</a>
										}
										{showLocalVendors[selectedPurposeIndex] &&
											(<div>
												<div class={style.vendorHeader}>
													<table class={style.vendorList}>
														<thead>
														<tr>
															<th><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.company : ''} localizeKey='company'>Company</LocalLabel></th>
														</tr>
														</thead>
													</table>
												</div>
												<div class={style.vendorContent}>
													<table class={style.vendorList}>
														<tbody>
														{localVendors[selectedPurposeIndex].map(({name, policyUrl}, index) => (
															<tr key={index + name} class={index % 2 === 1 ? style.even : ''}>
																<td><a href={policyUrl} target='_blank'><div class={style.vendorName}>{name}</div></a></td>
															</tr>
														))}
														</tbody>
													</table>
												</div>
											</div>)
										}
									</div>
								</div>
							</div> 
						</div>
					}
					</div>
				</div>
		);
	}
}
