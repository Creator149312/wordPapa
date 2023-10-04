'use client'
import GoogleAd from '@utils/GoogleAd';

const SideBar = () => {
  return (<>
          <div className='m-3'>
          <h2>Related Workbooks</h2>
          <div>
            <ul >
              <li className='no-style-list'>
                <a href="https://www.englishbix.com/product/35-word-family-words-tracing-workbook/">
                  Rhyming Words Tracing Workbook
                </a>
              </li>
              <li className='no-style-list'>
                <a href="https://www.englishbix.com/product/3-letter-rhyming-words-workbook/">
                  Rhyming Words Tracing Workbook
                </a>
              </li>
            </ul>
          </div>
            {/* <div>
              <GoogleAd slotID={3722270586}/>
            </div>  */}
          </div>
          <div className="m-3">
            {/* <div>
                <GoogleAd slotID={3722270586}/>
            </div> */}
          </div>
          </>
  )
}

export default SideBar