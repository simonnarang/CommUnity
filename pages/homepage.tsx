import { useEffect, useState } from 'react'
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { Database } from '../utils/database.types'
import { Events, EventType } from '../utils/event.types'
import EventFrame from '../components/EventFrame'
import { AppShell, Button, Grid, Header, MultiSelect } from '@mantine/core'


const blank_event = {
  id: '',
  org_name: '',
  event_name: '',
  event_flyer: '',
  location: '',
  event_time: '',
  type: '',
  event_avatar: ''
}

export default function Homepage({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()

  const user = useUser()

  const [events, setEvents] = useState<EventType[]>([blank_event])
  const [orderBy, setOrderBy] = useState<Events['event_name']>("")

  const retrieveEvents = async () => {
    try {
      if (!user) throw new Error('No user')

      let { data, error, status } = await supabase
      .from('events')
      .select()
      .order('event_time', {ascending: true})
      // TODO: throws error when orderBy is put in, need to fix

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        let array: EventType[] = []

        data.map((event) => {
          const { id, org_name, event_name, event_flyer, location, event_time, type, event_avatar} = event
          let receivedData: EventType = {
            id,
            org_name,
            event_name,
            event_flyer,
            location,
            event_time,
            type,
            event_avatar
          }
          array.push(receivedData)
        })
        setEvents(array)
      }
    } catch (error: any) {
      // TODO: add more
      if (error.message !== 'No user') {
        alert('Error, other than retrieving User, loading event data!')
      }
    }
  }
  
  useEffect(() => {
    retrieveEvents()
  }, [session, user, supabase, orderBy])

  return (

    <AppShell header={      
      <Header height={60} p="xs" className="header" id="headerHome">
      <ul>
        <li>
          <h1 id='logo'>CommUnity</h1>
        </li>
        <li>
      <div>
        <Button className="headerBtn" onClick={() => setOrderBy('event_time')}>
        ⬇️ &nbsp; Sort by Date
        </Button>
        <Link href="/addevent">
          <Button>📅 &nbsp; New Event</Button>
        </Link>
        <Link href="/profile">
          <Button className="headerBtn">💁 &nbsp; Profile</Button>
        </Link>
      </div>
      </li>
      </ul>
      </Header>
  }>
          <Grid style={{ padding: 50 }}>
        {JSON.stringify(events) !== '[]'
          ? events.map((event: EventType, index: any, sort: any) => {
              return event.event_name !== null ? (
                <Grid.Col md={6} lg={3}>
                  <EventFrame eventDetails={event} />
                </Grid.Col>
              ) : (
                <></>
              )
            })
          : 'No events!'}
      </Grid>

    </AppShell>
  )
}
