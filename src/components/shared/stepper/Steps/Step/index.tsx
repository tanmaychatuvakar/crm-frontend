import StepProps from './Step.props'
import useStepper from '../../hooks/useStepper'
import classNames from 'classnames'

export const Step: React.FC<StepProps> = ({ children, eventKey }) => {
  const [activeKey] = useStepper()
  const isActive = activeKey === eventKey

  return (
    <div
      className={classNames({
        hidden: !isActive,
      })}
    >
      {children}
    </div>
  )
}
