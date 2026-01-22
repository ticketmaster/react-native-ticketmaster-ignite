package com.ticketmasterignite

import android.app.Application
import android.content.ContentProvider
import android.content.ContentValues
import android.database.Cursor
import android.net.Uri
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton

/**
 * ContentProvider that initializes the Ticketmaster SDK early in the app lifecycle.
 *
 * This runs automatically before Application.onCreate(), ensuring the SDK's Koin
 * dependency injection is set up before any Activities or Fragments try to use it.
 * This prevents race conditions that can cause "No definition found for type
 * 'android.content.Context'" crashes.
 */
class TicketmasterInitProvider : ContentProvider() {

  override fun onCreate(): Boolean {
    val application = context?.applicationContext as? Application ?: return false
    TicketsSDKSingleton.init(application)
    return true
  }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? = null

    override fun getType(uri: Uri): String? = null

    override fun insert(uri: Uri, values: ContentValues?): Uri? = null

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?): Int = 0

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<out String>?
    ): Int = 0
}
