<?php

namespace App\Traits;

trait ArrayToObject
{
    /**
     * Get a container by key
     *
     * @param string The key container to retrieve
     */
    public function &__get($key)
    {
        return $this->container[$key];
    }

    /**
     * Assigns a value to the specified data
     *
     * @param string The container key to assign the value to
     * @param mixed  The value to set
     */
    public function __set($key, $value)
    {
        $this->container[$key] = $value;
    }

    /**
     * Whether or not an container exists by key
     *
     * @param string An container key to check for
     * @return bool
     *
     * @abstracting ArrayAccess
     */
    public function __isset($key)
    {
        return isset($this->container[$key]);
    }

    /**
     * Unsets an container by key
     *
     * @param string The key to unset
     */
    public function __unset($key)
    {
        unset($this->container[$key]);
    }
}
