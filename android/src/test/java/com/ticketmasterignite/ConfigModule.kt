package com.ticketmasterignite

import Config
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import io.mockk.MockK
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.Before
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.mockito.Mockito.mockStatic
import org.mockito.Mockito.verify
import org.mockito.MockitoAnnotations

class ConfigModuleTest {

  @Mock
  lateinit var mockContext: ReactApplicationContext

  @Mock
  lateinit var mockReadableMap: ReadableMap

  @Before
  fun setUp() {
    MockitoAnnotations.initMocks(this)
  }

  @Test
  fun `calls set on Config when setConfig called`() {
    val key = "primaryColor"
    val value = "red"
    val configModule = ConfigModule(mockContext)

    mockStatic(Config::class.java).use { mockedStatic ->
      configModule.setConfig(key, value)

      mockedStatic.verify { Config.set(key, value) }
    }
  }
}

