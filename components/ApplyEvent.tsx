import { useState, useEffect } from "react"

import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'

import { Database } from '../utils/database.types'

import { v4 as uuidv4 } from "uuid"

type Events = Database['public']['Tables']['events']['Row']


export function ApplyEvent() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const [org_name, setOrgName] = useState<Events['org_name']>(null)
  const [event_name, setEventName] = useState<Events['event_name']>(null)
  const [event_flyer, setEventFlyer] = useState<Events['event_flyer']>(null)
  const [location, setLocation] = useState<Events['location']>(null)
  const [event_time, setEventTime] = useState<Events['event_time']>(null)
    


  async function getEvent() {
    try {
      if (!user) throw new Error('No user')
  
      let { data, error, status } = await supabase
        .from('events')
        .select(`username, org_name, event_name, event_flyer, location, event_time, type`)
        .eq('id', user.id)
        .single()
  
      if (error && status !== 406) { throw new Error(error.message) }
  
      if (data) {
   
        setOrgName(data.org_name)
        setEventName(data.event_name)
        setEventFlyer(data.event_flyer)
        setLocation(data.location)
        setEventTime(data.event_time)
      }
    } catch (error) {
      alert('Error loading event data!')
    }
  }
  
    async function addEvent(

      {
        org_name,
        event_name,
        event_flyer,
        location,
        event_time,
      }: 
      {
        org_name: Events['org_name']
        event_name: Events['event_name']
        event_flyer: Events['event_flyer']
        location: Events['location']
        event_time: Events['event_time']
      }) {
        try {
          if (!user) throw new Error('No user')
  
          const updates = {
            id: uuidv4(),
            org_name,
            event_name,
            event_flyer,
            location,
            event_time,
            updated_at: new Date().toISOString(),
          }
  
          let { data, error } = await supabase.from('events').insert(updates);
          if (error) { throw error }
          alert('Event updated!')
        } catch (error) {
          console.log(error)
          alert('Error updating the event data!') 
     
        } 
    }

  return (
    <>
      <div className="form-widget">
        
          <div>
            <label htmlFor="org_name">Organization's Name</label>
            <input
              id="org_name"
              type="text"
              value={org_name || ''}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="event_flyer">Event Flyer</label>
            <input
              id="event_flyer"
              type="text"
              value={event_flyer || ''}
              onChange={(e) => setEventFlyer(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="event_name">Name of Event</label>
            <input
              id="event_name"
              type="text"
              value={event_name || ''}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="location">Location of Event</label>
            <input
              id="location"
              type="text"
              value={location || ''}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="event_time"> Date & Time of Event</label>
            <input
              id="event_time"
              type="text"
              value={event_time || ''}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </div>

          {/** this throws an error in line 167 
             * need to add this to another page as well
          */} 

          <div>
            <button
              className="button block"
              onClick={() => addEvent({org_name, event_name, event_flyer, location, event_time })}
            >
              Update
            </button>
          </div> 
        </div>
    </>
  )
}