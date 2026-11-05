interface FlagProps {
  className?: string
}

export function TurkeyFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#E30A17"/>
      <circle cx="11" cy="10" r="5" fill="white"/>
      <circle cx="12.5" cy="10" r="4" fill="#E30A17"/>
      <path d="M16.5 10L14 7.5L15.5 10L14 12.5L16.5 10Z" fill="white"/>
    </svg>
  )
}

export function USAFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#FFFFFF"/>
      <rect y="0" width="30" height="1.54" fill="#B22234"/>
      <rect y="3.08" width="30" height="1.54" fill="#B22234"/>
      <rect y="6.15" width="30" height="1.54" fill="#B22234"/>
      <rect y="9.23" width="30" height="1.54" fill="#B22234"/>
      <rect y="12.31" width="30" height="1.54" fill="#B22234"/>
      <rect y="15.38" width="30" height="1.54" fill="#B22234"/>
      <rect y="18.46" width="30" height="1.54" fill="#B22234"/>
      <rect width="12" height="10.77" fill="#3C3B6E"/>
      <g fill="white">
        <circle cx="1.5" cy="1.2" r="0.5"/>
        <circle cx="3.5" cy="1.2" r="0.5"/>
        <circle cx="5.5" cy="1.2" r="0.5"/>
        <circle cx="7.5" cy="1.2" r="0.5"/>
        <circle cx="9.5" cy="1.2" r="0.5"/>
        <circle cx="2.5" cy="2.4" r="0.5"/>
        <circle cx="4.5" cy="2.4" r="0.5"/>
        <circle cx="6.5" cy="2.4" r="0.5"/>
        <circle cx="8.5" cy="2.4" r="0.5"/>
        <circle cx="10.5" cy="2.4" r="0.5"/>
        <circle cx="1.5" cy="3.6" r="0.5"/>
        <circle cx="3.5" cy="3.6" r="0.5"/>
        <circle cx="5.5" cy="3.6" r="0.5"/>
        <circle cx="7.5" cy="3.6" r="0.5"/>
        <circle cx="9.5" cy="3.6" r="0.5"/>
        <circle cx="2.5" cy="4.8" r="0.5"/>
        <circle cx="4.5" cy="4.8" r="0.5"/>
        <circle cx="6.5" cy="4.8" r="0.5"/>
        <circle cx="8.5" cy="4.8" r="0.5"/>
        <circle cx="10.5" cy="4.8" r="0.5"/>
        <circle cx="1.5" cy="6" r="0.5"/>
        <circle cx="3.5" cy="6" r="0.5"/>
        <circle cx="5.5" cy="6" r="0.5"/>
        <circle cx="7.5" cy="6" r="0.5"/>
        <circle cx="9.5" cy="6" r="0.5"/>
        <circle cx="2.5" cy="7.2" r="0.5"/>
        <circle cx="4.5" cy="7.2" r="0.5"/>
        <circle cx="6.5" cy="7.2" r="0.5"/>
        <circle cx="8.5" cy="7.2" r="0.5"/>
        <circle cx="10.5" cy="7.2" r="0.5"/>
        <circle cx="1.5" cy="8.4" r="0.5"/>
        <circle cx="3.5" cy="8.4" r="0.5"/>
        <circle cx="5.5" cy="8.4" r="0.5"/>
        <circle cx="7.5" cy="8.4" r="0.5"/>
        <circle cx="9.5" cy="8.4" r="0.5"/>
        <circle cx="2.5" cy="9.6" r="0.5"/>
        <circle cx="4.5" cy="9.6" r="0.5"/>
        <circle cx="6.5" cy="9.6" r="0.5"/>
        <circle cx="8.5" cy="9.6" r="0.5"/>
        <circle cx="10.5" cy="9.6" r="0.5"/>
      </g>
    </svg>
  )
}

export function UKFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#012169"/>
      <path d="M0 0L30 20M30 0L0 20" stroke="white" strokeWidth="4"/>
      <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="2"/>
      <path d="M15 0V20M0 10H30" stroke="white" strokeWidth="6"/>
      <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="4"/>
    </svg>
  )
}

export function EUFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#003399"/>
      <g fill="#FFCC00">
        <polygon points="15,3 15.5,4.5 17,4.5 15.75,5.5 16.25,7 15,6 13.75,7 14.25,5.5 13,4.5 14.5,4.5"/>
        <polygon points="10,4 10.5,5.5 12,5.5 10.75,6.5 11.25,8 10,7 8.75,8 9.25,6.5 8,5.5 9.5,5.5"/>
        <polygon points="7,7 7.5,8.5 9,8.5 7.75,9.5 8.25,11 7,10 5.75,11 6.25,9.5 5,8.5 6.5,8.5"/>
        <polygon points="7,13 7.5,14.5 9,14.5 7.75,15.5 8.25,17 7,16 5.75,17 6.25,15.5 5,14.5 6.5,14.5"/>
        <polygon points="10,16 10.5,17.5 12,17.5 10.75,18.5 11.25,20 10,19 8.75,20 9.25,18.5 8,17.5 9.5,17.5"/>
        <polygon points="20,4 20.5,5.5 22,5.5 20.75,6.5 21.25,8 20,7 18.75,8 19.25,6.5 18,5.5 19.5,5.5"/>
        <polygon points="23,7 23.5,8.5 25,8.5 23.75,9.5 24.25,11 23,10 21.75,11 22.25,9.5 21,8.5 22.5,8.5"/>
        <polygon points="23,13 23.5,14.5 25,14.5 23.75,15.5 24.25,17 23,16 21.75,17 22.25,15.5 21,14.5 22.5,14.5"/>
        <polygon points="20,16 20.5,17.5 22,17.5 20.75,18.5 21.25,20 20,19 18.75,20 19.25,18.5 18,17.5 19.5,17.5"/>
        <polygon points="15,17 15.5,18.5 17,18.5 15.75,19.5 16.25,21 15,20 13.75,21 14.25,19.5 13,18.5 14.5,18.5"/>
      </g>
    </svg>
  )
}

export function getFlagComponent(code: string) {
  switch (code) {
    case "TR":
      return TurkeyFlag
    case "US":
      return USAFlag
    case "UK":
      return UKFlag
    case "EU":
      return EUFlag
    default:
      return USAFlag
  }
}
