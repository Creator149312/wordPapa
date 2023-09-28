'use client'
import GoogleAd from '@utils/GoogleAd';

const SideBar = () => {
  return (<>
          <div className='m-3'>
          <h2>Your Ads Will be Displayed Here</h2>
            <div>
              <GoogleAd slotID={3722270586}/>
            </div>
          </div>
          <div className="m-3">
            <div>
                <GoogleAd slotID={3722270586}/>
            </div>
          </div>
          </>
  )
}

export default SideBar