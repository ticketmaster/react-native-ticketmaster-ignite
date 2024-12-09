package com.ticketmasterignite

import org.junit.Test
import org.junit.Assert.*

class EventHeaderTest {

    @Test
    fun `getShowInfoToolbarButtonValue with EVENT_INFO`() {
      val result = EventHeader.getShowInfoToolbarButtonValue(EventHeaderType.EVENT_INFO.value)
      assertTrue("The button should be shown for EVENT_INFO", result)
    }

    @Test
    fun `getShowInfoToolbarButtonValue with EVENT_SHARE`() {
      val result = EventHeader.getShowInfoToolbarButtonValue(EventHeaderType.EVENT_SHARE.value)
      assertFalse("The button should not be shown for EVENT_SHARE", result)
    }

    @Test
    fun `getShowInfoToolbarButtonValue with EVENT_INFO_SHARE`() {
      val result = EventHeader.getShowInfoToolbarButtonValue(EventHeaderType.EVENT_INFO_SHARE.value)
      assertTrue( "The button should be shown for EVENT_INFO_SHARE", result)
    }

    @Test
    fun `getShowInfoToolbarButtonValue with NO_TOOLBARS`() {
      val result = EventHeader.getShowInfoToolbarButtonValue(EventHeaderType.NO_TOOLBARS.value)
      assertFalse("The button should not be shown for NO_TOOLBARS", result)
    }

    @Test
    fun `getShowShareToolbarButtonValue with EVENT_INFO`() {
      val result = EventHeader.getShowShareToolbarButtonValue(EventHeaderType.EVENT_INFO.value)
      assertFalse("The button should not be shown for EVENT_INFO", result)
    }

    @Test
    fun `getShowShareToolbarButtonValue with EVENT_SHARE`() {
      val result = EventHeader.getShowShareToolbarButtonValue(EventHeaderType.EVENT_SHARE.value)
      assertTrue("The button should be shown for EVENT_SHARE", result)
    }

    @Test
    fun `getShowShareToolbarButtonValue with EVENT_INFO_SHARE`() {
      val result = EventHeader.getShowShareToolbarButtonValue(EventHeaderType.EVENT_INFO_SHARE.value)
      assertTrue("The button should be shown for EVENT_INFO_SHARE", result)
    }

    @Test
    fun `getShowShareToolbarButtonValue with NO_TOOLBARS`() {
      val result = EventHeader.getShowShareToolbarButtonValue(EventHeaderType.NO_TOOLBARS.value)
      assertFalse("The button should not be shown for NO_TOOLBARS", result)
    }
}


