import Button from '@mui/material/Button';

interface DashboardBoxProps {
  color?: [string, string];
  grow?: boolean;
  icon?: React.ReactNode;
}

const DashboardBox = (props: DashboardBoxProps) => {

    return (
        <>
            <Button className="dashboardBox" style={{
                backgroundImage: `linear-gradient(to right, ${props.color?.[0]}, ${props.color?.[1]})`
            }}>

                <div className="d-flex w-100">
                    <div className="col1 mb-0">
                        <h4 className='text-white'>Budget</h4>
                        <span className='text-white'>99.999.999 Ar</span>
                    </div>

                    <div className="ms-auto">
                        <div className="icon">
                            {props.icon}
                        </div>
                    </div>
                </div>

                <div className="align-items-center w-100 bottomEle">
                    <div className="">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-250">Engagé</p>
                                <p className="text-sm font-medium">70.000.000 Ar</p>
                            </div>
                            <div>
                                <p className="text-gray-250">Dépensé</p>
                                <p className="text-sm font-medium">29.999.999 Ar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Button>
        </>
    )
}

export default DashboardBox