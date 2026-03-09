package com.ticketmasterignite

import org.junit.Test
import org.junit.Assert.*

class ConfigTest {

    @Test
    fun `set and get for existing key`() {
        val key = "primaryColor"
        val value = "red"

        Config.set(key, value)
        val result = Config.get(key)

        assertEquals("The value returned by get() should match the set value", value, result)
    }

    @Test
    fun `get with non-existing key returns an empty string`() {
        val key = "non_existent_key"

        val result = Config.get(key)

        assertEquals("The value should be empty string for a non-existing key", "", result)
    }

    @Test
    fun `optionalString for existing key returns the value`() {
        val key = "primaryColor"
        val value = "red"
        Config.set(key, value)

        val result = Config.optionalString(key)

        assertEquals("The optionalString() should return the correct value", value, result)
    }

    @Test
    fun `optionalString with non-existing key returns null`() {
        val key = "non_existent_key"

        val result = Config.optionalString(key)

        assertNull("The optionalString() should return null for non-existing keys", result)
    }

    @Test
    fun `setImage and getImage for existing image`() {
        val key = "seats_config"
        val uri =  "https://example.com/image.png"

        Config.setImage(key, uri)
        val result = Config.getImage(key)

        assertEquals("The getImage() should return the correct image JSON string", uri, result)
    }

    @Test
    fun `getImage with non-existing key returns null`() {
        val key = "non_existent_image_key"

        val result = Config.getImage(key)

        assertNull("The getImage() should return null for non-existing keys", result)
    }
}
